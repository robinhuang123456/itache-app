'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session, AuthError, AuthResponse } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface UserContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<AuthResponse>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  isOpenLoginModal: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  session: null,
  loading: true,
  signUpWithEmail: async () => ({ data: { user: null, session: null }, error: null }),
  signInWithEmail: async () => ({ error: null }),
  signOut: async () => {},
  isOpenLoginModal: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const supabase = createClient();

  // 监听认证状态变化
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 邮箱注册
  const signUpWithEmail = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        },
      });
      return response;
    },
    []
  );

  // 邮箱登录
  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    },
    []
  );

  // 登出
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const openLoginModal = useCallback(() => setIsOpenLoginModal(true), []);
  const closeLoginModal = useCallback(() => setIsOpenLoginModal(false), []);

  return (
    <UserContext.Provider
      value={{
        user,
        session,
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
