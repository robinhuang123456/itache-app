'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

/**
 * 认证上下文 - 完全基于自有 API 路由
 *
 * 不再使用浏览器端 Supabase SDK，所有认证请求通过
 * /api/auth/* 路由在服务端完成，避免蜂窝网络下
 * Supabase 域名被运营商拦截导致登录失败。
 */

// 简化的用户类型（只包含前端需要的字段）
export interface AppUser {
  id: string;
  email: string;
}

interface SignUpResult {
  user: AppUser | null;
  error: string | null;
  autoLogin: boolean;
}

interface SignInResult {
  user: AppUser | null;
  error: string | null;
}

interface UserContextType {
  user: AppUser | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<SignUpResult>;
  signInWithEmail: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  isOpenLoginModal: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  signUpWithEmail: async () => ({ user: null, error: null, autoLogin: false }),
  signInWithEmail: async () => ({ user: null, error: null }),
  signOut: async () => {},
  isOpenLoginModal: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
});

// 会话检查超时：如果服务端 8 秒未响应，解除 loading 让用户可以操作
const SESSION_TIMEOUT = 8000;

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);

  // 页面加载时检查会话状态
  useEffect(() => {
    let cancelled = false;

    const timeoutId = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, SESSION_TIMEOUT);

    fetch('/api/auth/session', {
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  // 邮箱注册
  const signUpWithEmail = useCallback(
    async (email: string, password: string): Promise<SignUpResult> => {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          return { user: null, error: data.error || '注册失败', autoLogin: false };
        }

        // 如果自动登录，更新用户状态
        if (data.autoLogin && data.user) {
          setUser(data.user);
        }

        return {
          user: data.user || null,
          error: null,
          autoLogin: data.autoLogin || false,
        };
      } catch {
        return { user: null, error: '网络错误，请重试', autoLogin: false };
      }
    },
    []
  );

  // 邮箱登录
  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<SignInResult> => {
      try {
        const res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          return { user: null, error: data.error || '登录失败' };
        }

        // 登录成功，更新用户状态
        if (data.user) {
          setUser(data.user);
        }

        return { user: data.user || null, error: null };
      } catch {
        return { user: null, error: '网络错误，请重试' };
      }
    },
    []
  );

  // 登出
  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } catch {
      // 忽略错误，前端仍然清除状态
    }
    setUser(null);
  }, []);

  const openLoginModal = useCallback(() => setIsOpenLoginModal(true), []);
  const closeLoginModal = useCallback(() => setIsOpenLoginModal(false), []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        signUpWithEmail,
        signInWithEmail,
        signOut,
        isOpenLoginModal,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
