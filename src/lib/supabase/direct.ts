import { cookies } from 'next/headers';

/**
 * 直接调用 Supabase REST API 的轻量客户端
 *
 * 不依赖 @supabase/ssr 或 @supabase/supabase-js SDK，
 * 通过原生 fetch 直接请求 Supabase Auth 和 Database REST API，
 * 避免 SDK 在 Vercel Serverless 环境下的 fetch failed 问题。
 */

// trim() 清除 Vercel 环境变量可能携带的尾部换行符 \r\n，
// 否则 fetch URL 会变成 "https://xxx\r\n/auth/v1/..." 导致请求失败
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// Cookie 名称
const ACCESS_TOKEN_COOKIE = 'sb-access-token';
const REFRESH_TOKEN_COOKIE = 'sb-refresh-token';

// Token 过期时间（秒）— Supabase 默认 3600 秒
const TOKEN_EXPIRES = 3600;

interface SupabaseUser {
  id: string;
  email: string;
}

interface AuthResponse {
  user: SupabaseUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
}

/**
 * 通用请求头
 */
function getHeaders(accessToken?: string) {
  const headers: Record<string, string> = {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return headers;
}

/**
 * 邮箱密码登录
 * POST {SUPABASE_URL}/auth/v1/token?grant_type=password
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data.message === 'Invalid login credentials'
        ? '邮箱或密码错误'
        : data.message || data.error_description || '登录失败';
      return { user: null, accessToken: null, refreshToken: null, error: msg };
    }

    return {
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
      accessToken: data.access_token || null,
      refreshToken: data.refresh_token || null,
      error: null,
    };
  } catch (err) {
    console.error('[Direct Supabase] signIn failed:', err);
    return { user: null, accessToken: null, refreshToken: null, error: '连接服务器失败，请稍后重试' };
  }
}

/**
 * 邮箱注册
 * POST {SUPABASE_URL}/auth/v1/signup
 */
export async function signUpWithEmail(email: string, password: string): Promise<AuthResponse & { autoLogin: boolean }> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data.message === 'User already registered'
        ? '该邮箱已注册，请直接登录'
        : data.message || data.error_description || '注册失败';
      return { user: null, accessToken: null, refreshToken: null, error: msg, autoLogin: false };
    }

    // 如果返回了 access_token，说明 Confirm email 已关闭，自动登录
    if (data.access_token) {
      return {
        user: data.user ? { id: data.user.id, email: data.user.email } : null,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        error: null,
        autoLogin: true,
      };
    }

    // 没有 token，需要邮箱验证
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      error: null,
      autoLogin: false,
    };
  } catch (err) {
    console.error('[Direct Supabase] signUp failed:', err);
    return { user: null, accessToken: null, refreshToken: null, error: '连接服务器失败，请稍后重试', autoLogin: false };
  }
}

/**
 * 获取当前用户信息
 * GET {SUPABASE_URL}/auth/v1/user
 */
export async function getUser(accessToken: string): Promise<SupabaseUser | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: getHeaders(accessToken),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.id ? { id: data.id, email: data.email } : null;
  } catch {
    return null;
  }
}

/**
 * 刷新 token
 * POST {SUPABASE_URL}/auth/v1/token?grant_type=refresh_token
 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { user: null, accessToken: null, refreshToken: null, error: 'refresh failed' };
    }

    return {
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
      accessToken: data.access_token || null,
      refreshToken: data.refresh_token || null,
      error: null,
    };
  } catch {
    return { user: null, accessToken: null, refreshToken: null, error: 'refresh failed' };
  }
}

/**
 * 登出
 * POST {SUPABASE_URL}/auth/v1/logout
 */
export async function signOut(accessToken: string): Promise<void> {
  try {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: getHeaders(accessToken),
    });
  } catch {
    // 忽略错误
  }
}

// ==================== Cookie 管理 ====================

/**
 * 设置认证 cookie
 */
export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_EXPIRES,
    path: '/',
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_EXPIRES * 2, // refresh token 有效期更长
    path: '/',
  });
}

/**
 * 清除认证 cookie
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

/**
 * 从 cookie 获取有效的 access token
 * 如果 access token 过期，尝试用 refresh token 刷新
 */
export async function getValidAccessToken(): Promise<{ token: string | null; user: SupabaseUser | null }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return { token: null, user: null };
  }

  // 尝试用 access token 获取用户信息
  const user = await getUser(accessToken);
  if (user) {
    return { token: accessToken, user };
  }

  // access token 无效，尝试刷新
  if (refreshToken) {
    const refreshResult = await refreshAccessToken(refreshToken);
    if (refreshResult.accessToken && refreshResult.refreshToken) {
      await setAuthCookies(refreshResult.accessToken, refreshResult.refreshToken);
      return { token: refreshResult.accessToken, user: refreshResult.user };
    }
  }

  // 刷新也失败，清除 cookie
  await clearAuthCookies();
  return { token: null, user: null };
}

// ==================== 数据库操作 ====================

/**
 * 通用 Supabase 数据库查询
 * GET {SUPABASE_URL}/rest/v1/{table}
 */
export async function dbSelect(
  table: string,
  options: {
    select?: string;
    filters?: Record<string, string | boolean | null>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
  }
): Promise<{ data: Record<string, unknown>[] | null; error: string | null }> {
  try {
    const params = new URLSearchParams();
    params.set('select', options.select || '*');

    if (options.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        if (value === null) {
          params.set(key, 'is.null');
        } else if (typeof value === 'boolean') {
          params.set(key, `eq.${value}`);
        } else {
          params.set(key, `eq.${value}`);
        }
      }
    }

    if (options.order) {
      params.set('order', `${options.order.column}.${options.order.ascending ? 'asc' : 'desc'}`);
    }

    if (options.limit) {
      params.set('limit', String(options.limit));
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Direct Supabase] dbSelect ${table} failed:`, res.status, errorText);
      return { data: null, error: `查询失败: ${res.status}` };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    console.error(`[Direct Supabase] dbSelect ${table} error:`, err);
    return { data: null, error: '数据库连接失败' };
  }
}

/**
 * 通用 Supabase 数据库插入
 * POST {SUPABASE_URL}/rest/v1/{table}
 */
export async function dbInsert(
  table: string,
  record: Record<string, unknown>
): Promise<{ error: string | null }> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(record),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Direct Supabase] dbInsert ${table} failed:`, res.status, errorText);
      return { error: `保存失败: ${res.status}` };
    }

    return { error: null };
  } catch (err) {
    console.error(`[Direct Supabase] dbInsert ${table} error:`, err);
    return { error: '数据库连接失败' };
  }
}

/**
 * 通用 Supabase 数据库更新
 * PATCH {SUPABASE_URL}/rest/v1/{table}?id=eq.{id}
 */
export async function dbUpdate(
  table: string,
  id: string,
  record: Record<string, unknown>
): Promise<{ error: string | null }> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        ...getHeaders(),
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(record),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Direct Supabase] dbUpdate ${table} failed:`, res.status, errorText);
      return { error: `更新失败: ${res.status}` };
    }

    return { error: null };
  } catch (err) {
    console.error(`[Direct Supabase] dbUpdate ${table} error:`, err);
    return { error: '数据库连接失败' };
  }
}

/**
 * 通用 Supabase 数据库删除
 * DELETE {SUPABASE_URL}/rest/v1/{table}?id=eq.{id}
 */
export async function dbDelete(
  table: string,
  id: string
): Promise<{ error: string | null }> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Direct Supabase] dbDelete ${table} failed:`, res.status, errorText);
      return { error: `删除失败: ${res.status}` };
    }

    return { error: null };
  } catch (err) {
    console.error(`[Direct Supabase] dbDelete ${table} error:`, err);
    return { error: '数据库连接失败' };
  }
}
