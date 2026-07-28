'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  signInWithEmail as supabaseSignIn,
  signUpWithEmail as supabaseSignUp,
  getSession,
  signOut as supabaseSignOut,
} from '@/lib/supabase/browser';

/**
 * 认证上下文 - 浏览器直连 Supabase REST API
 *
 * 不再通过 Vercel API 路由中转，因为 Vercel 香港节点无法连接 ADB Supabase。
 * 浏览器直接使用原生 fetch 调用 Supabase Auth API，
 * 避免了 SDK 的 WebSocket 问题，也绕过了 Vercel 的网络限制。
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

// 会话检查超时：如果服务端 10 秒未响应，解除 loading 让用户可以操作
const SESSION_TIMEOUT = 10000;

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);

  // 页面加载时检查会话状态（直接调用 Supabase，不走 Vercel）
  useEffect(() => {
    let cancelled = false;

    const timeoutId = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, SESSION_TIMEOUT);

    getSession()
      .then((sessionUser) => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        setUser(sessionUser);
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

  // 邮箱注册（直接调用 Supabase，不走 Vercel）
  const signUpWithEmail = useCallback(
    async (email: string, password: string): Promise<SignUpResult> => {
      const result = await supabaseSignUp(email, password);

      if (result.error) {
        return { user: null, error: result.error, autoLogin: false };
      }

      // 如果自动登录，更新用户状态
      if (result.autoLogin && result.user) {
        setUser(result.user);
      }

      return {
        user: result.user || null,
        error: null,
        autoLogin: result.autoLogin || false,
      };
    },
    []
  );

  // 邮箱登录（直接调用 Supabase，不走 Vercel）
  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<SignInResult> => {
      const result = await supabaseSignIn(email, password);

      if (result.error || !result.user) {
        return { user: null, error: result.error || '登录失败' };
      }

      // 登录成功，更新用户状态
      setUser(result.user);
      return { user: result.user, error: null };
    },
    []
  );

  // 登出（直接调用 Supabase，不走 Vercel）
  const signOut = useCallback(async () => {
    await supabaseSignOut();
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
