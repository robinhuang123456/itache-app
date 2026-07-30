/**
 * 浏览器端 Supabase 轻量客户端
 *
 * 直接使用原生 fetch 调用 Supabase REST API，不依赖 Supabase JS SDK。
 *
 * 为什么不用 Supabase SDK？
 * - SDK 会创建 WebSocket 连接（realtime），在蜂窝网络下被运营商拦截
 * - SDK 的 token 刷新机制绕过自定义 fetch 设置，导致 4G 网络下请求失败
 * - 原生 fetch 只有标准 HTTP 请求，不触发运营商的 WebSocket/QoS 限制
 *
 * 为什么不走 Vercel API 代理？
 * - Vercel 香港节点无法连接 ADB Supabase 服务器（TCP 连接超时）
 * - 浏览器在中国网络环境下可以直接访问 Supabase（0.3秒响应）
 *
 * 安全性：
 * - NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY 本就是公开的
 *   （NEXT_PUBLIC_ 前缀表示可在浏览器使用）
 * - Supabase 的安全由 RLS（行级安全）策略保障，而非隐藏 anon key
 */

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// localStorage 存储 key
const ACCESS_TOKEN_KEY = 'sb-access-token';
const REFRESH_TOKEN_KEY = 'sb-refresh-token';
const USER_KEY = 'sb-user';

// 请求超时
const AUTH_TIMEOUT = 15000; // 认证请求 15 秒超时（蜂窝网络下需要更长时间）
const DATA_TIMEOUT = 10000; // 数据请求 10 秒超时

interface SupabaseUser {
  id: string;
  email: string;
}

// ==================== 工具函数 ====================

function getHeaders(accessToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return headers;
}

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setTokens(accessToken: string, refreshToken: string, user: SupabaseUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getStoredUser(): SupabaseUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * 带超时的 fetch
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

// ==================== 认证 ====================

export interface AuthResult {
  user: SupabaseUser | null;
  error: string | null;
}

export interface SignUpResult extends AuthResult {
  autoLogin: boolean;
}

/**
 * 邮箱密码登录
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const res = await fetchWithTimeout(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email: email.trim(), password }),
      },
      AUTH_TIMEOUT
    );

    const data = await res.json();

    if (!res.ok) {
      const msg =
        data.message === 'Invalid login credentials'
          ? '邮箱或密码错误'
          : data.message || data.error_description || '登录失败';
      return { user: null, error: msg };
    }

    const user: SupabaseUser = {
      id: data.user.id,
      email: data.user.email,
    };
    setTokens(data.access_token, data.refresh_token, user);
    return { user, error: null };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { user: null, error: '登录超时，请尝试切换 WiFi/4G 后重试' };
    }
    return { user: null, error: '连接服务器失败，请稍后重试' };
  }
}

/**
 * 邮箱注册
 */
export async function signUpWithEmail(email: string, password: string): Promise<SignUpResult> {
  try {
    const res = await fetchWithTimeout(
      `${SUPABASE_URL}/auth/v1/signup`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email: email.trim(), password }),
      },
      AUTH_TIMEOUT
    );

    const data = await res.json();

    if (!res.ok) {
      const msg =
        data.message === 'User already registered'
          ? '该邮箱已注册，请直接登录'
          : data.message || data.error_description || '注册失败';
      return { user: null, error: msg, autoLogin: false };
    }

    // 如果返回了 access_token，说明 Confirm email 已关闭，自动登录
    if (data.access_token) {
      const user: SupabaseUser = {
        id: data.user.id,
        email: data.user.email,
      };
      setTokens(data.access_token, data.refresh_token, user);
      return { user, error: null, autoLogin: true };
    }

    // 没有 token，需要邮箱验证
    return { user: null, error: null, autoLogin: false };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { user: null, error: '注册超时，请尝试切换 WiFi/4G 后重试，或清除浏览器缓存后重试', autoLogin: false };
    }
    return { user: null, error: '连接服务器失败，请稍后重试。如多次失败请尝试清除浏览器缓存或使用无痕模式', autoLogin: false };
  }
}

/**
 * 获取当前会话（检查 token 是否有效）
 * 如果 access token 过期，尝试用 refresh token 刷新
 */
export async function getSession(): Promise<SupabaseUser | null> {
  const accessToken = getAccessToken();
  const storedUser = getStoredUser();

  if (!accessToken) {
    return null;
  }

  // 尝试用 access token 获取用户信息（验证 token 是否有效）
  try {
    const res = await fetchWithTimeout(
      `${SUPABASE_URL}/auth/v1/user`,
      { headers: getHeaders(accessToken) },
      AUTH_TIMEOUT
    );

    if (res.ok) {
      const data = await res.json();
      const user: SupabaseUser = { id: data.id, email: data.email };
      // 更新存储的用户信息
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    }
  } catch {
    // 网络错误，返回已存储的用户（乐观策略）
    return storedUser;
  }

  // access token 无效，尝试用 refresh token 刷新
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const res = await fetchWithTimeout(
      `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ refresh_token: refreshToken }),
      },
      AUTH_TIMEOUT
    );

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    const user: SupabaseUser = {
      id: data.user.id,
      email: data.user.email,
    };
    setTokens(data.access_token, data.refresh_token, user);
    return user;
  } catch {
    // 网络错误，返回已存储的用户（乐观策略）
    return storedUser;
  }
}

/**
 * 登出
 */
export async function signOut(): Promise<void> {
  const accessToken = getAccessToken();
  if (accessToken) {
    try {
      await fetchWithTimeout(
        `${SUPABASE_URL}/auth/v1/logout`,
        {
          method: 'POST',
          headers: getHeaders(accessToken),
        },
        5000
      );
    } catch {
      // 忽略错误，前端仍然清除 token
    }
  }
  clearTokens();
}

// ==================== 数据库操作 ====================

import type { Car } from '@/lib/data';
import { mapRowToCar } from '@/lib/car-mapper';

/**
 * 获取所有可见车辆（demo + 用户添加）
 * 无需登录，RLS 允许查询 is_visible = true 的记录
 */
export async function fetchAllCars(): Promise<Car[]> {
  try {
    // 并行查询 demo 车辆和用户添加车辆
    const [demoRes, userRes] = await Promise.all([
      fetchWithTimeout(
        `${SUPABASE_URL}/rest/v1/cars?select=*&is_demo=eq.true&order=created_at.desc`,
        { headers: getHeaders() },
        DATA_TIMEOUT
      ),
      fetchWithTimeout(
        `${SUPABASE_URL}/rest/v1/cars?select=*&is_user_added=eq.true&is_demo=eq.false&order=created_at.desc`,
        { headers: getHeaders() },
        DATA_TIMEOUT
      ),
    ]);

    const demoCars: Car[] = demoRes.ok ? (await demoRes.json()).map(mapRowToCar) : [];
    const userCars: Car[] = userRes.ok ? (await userRes.json()).map(mapRowToCar) : [];

    return [...demoCars, ...userCars];
  } catch (err) {
    console.error('[Browser Supabase] fetchAllCars error:', err);
    return [];
  }
}

/**
 * 保存新车辆（需要登录）
 */
export async function saveCar(car: Car): Promise<string | null> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return '请先登录后再添加痛车';
  }

  try {
    const res = await fetchWithTimeout(
      `${SUPABASE_URL}/rest/v1/cars`,
      {
        method: 'POST',
        headers: {
          ...getHeaders(accessToken),
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          id: car.id,
          nickname: car.nickname,
          brand: car.brand,
          model: car.model,
          ip_tags: car.ipTags,
          city: car.city,
          city_name: car.cityName,
          contact_type: car.contactType,
          contact_value: car.contactValue,
          contact_type2: car.contactType2 || null,
          contact_value2: car.contactValue2 || null,
          photos: car.photos,
          lat: car.lat,
          lng: car.lng,
          is_visible: true,
          is_user_added: true,
          is_demo: false,
          created_at: car.createdAt,
          province: car.province || null,
          district: car.district || null,
          avatar: car.avatar || null,
          bio: car.bio || null,
          hobbies: car.hobbies || null,
          gender: car.gender || null,
          occupation: car.occupation || null,
          cost_range: car.costRange || null,
          shop_name: car.shopName || null,
          design_source: car.designSource || null,
        }),
      },
      DATA_TIMEOUT
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return data.message || `保存失败: ${res.status}`;
    }

    return null;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return '网络超时，请检查网络后重试';
    }
    return '网络错误，请稍后重试';
  }
}

/**
 * 获取当前用户添加的车辆
 * 必须按 user_id 过滤，确保不同用户只能看到自己的痛车
 */
export async function fetchUserCars(): Promise<Car[]> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return [];
  }

  const storedUser = getStoredUser();
  if (!storedUser || !storedUser.id) {
    return [];
  }

  try {
    const res = await fetchWithTimeout(
      `${SUPABASE_URL}/rest/v1/cars?select=*&user_id=eq.${storedUser.id}&is_user_added=eq.true&is_demo=eq.false&order=created_at.desc`,
      { headers: getHeaders(accessToken) },
      DATA_TIMEOUT
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.map(mapRowToCar);
  } catch {
    return [];
  }
}

/**
 * 更新车辆信息
 */
export async function updateCar(car: Car, carId: string): Promise<string | null> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return '请先登录';
  }

  try {
    const res = await fetchWithTimeout(
      `${SUPABASE_URL}/rest/v1/cars?id=eq.${carId}`,
      {
        method: 'PATCH',
        headers: {
          ...getHeaders(accessToken),
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          nickname: car.nickname,
          brand: car.brand,
          model: car.model,
          ip_tags: car.ipTags,
          city: car.city,
          city_name: car.cityName,
          contact_type: car.contactType,
          contact_value: car.contactValue,
          contact_type2: car.contactType2 || null,
          contact_value2: car.contactValue2 || null,
          photos: car.photos,
          lat: car.lat,
          lng: car.lng,
          is_visible: car.isVisible,
          province: car.province || null,
          district: car.district || null,
          avatar: car.avatar || null,
          bio: car.bio || null,
          hobbies: car.hobbies || null,
          gender: car.gender || null,
          occupation: car.occupation || null,
          cost_range: car.costRange || null,
          shop_name: car.shopName || null,
          design_source: car.designSource || null,
        }),
      },
      DATA_TIMEOUT
    );

    if (!res.ok) {
      return `更新失败: ${res.status}`;
    }

    return null;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return '网络超时，请检查网络后重试';
    }
    return '网络错误，请稍后重试';
  }
}

/**
 * 删除车辆
 */
export async function deleteCar(carId: string): Promise<string | null> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return '请先登录';
  }

  try {
    const res = await fetchWithTimeout(
      `${SUPABASE_URL}/rest/v1/cars?id=eq.${carId}`,
      {
        method: 'DELETE',
        headers: getHeaders(accessToken),
      },
      DATA_TIMEOUT
    );

    if (!res.ok) {
      return `删除失败: ${res.status}`;
    }

    return null;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return '网络超时，请检查网络后重试';
    }
    return '网络错误，请稍后重试';
  }
}
