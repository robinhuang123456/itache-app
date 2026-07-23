'use client';

import { useUser } from '@/lib/auth-context';
import { User, LogOut, Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { user, loading, signOut, openLoginModal } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center w-9 h-9 rounded-full">
        <Loader2 className="w-4 h-4 text-[var(--color-text-secondary)] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={openLoginModal}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white text-xs font-medium shadow-sm hover:shadow-md transition-shadow"
      >
        <User className="w-3.5 h-3.5" />
        登录 / 注册
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-xs max-w-[160px]">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-[10px] font-medium shrink-0">
          U
        </div>
        <span className="text-[var(--color-text-secondary)] truncate">
          {user.email?.split('@')[0] || '用户'}
        </span>
      </div>
      <button
        onClick={signOut}
        className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors shrink-0"
        title="退出登录"
      >
        <LogOut className="w-3 h-3 text-[var(--color-text-secondary)]" />
      </button>
    </div>
  );
}
