'use client';

import { useState } from 'react';
import { X, Mail, Lock, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useUser } from '@/lib/auth-context';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { signInWithEmail, signUpWithEmail } = useUser();

  if (!isOpen) return null;

  const validate = () => {
    if (!email.trim()) return '请输入邮箱地址';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '请输入有效的邮箱地址';
    if (!password) return '请输入密码';
    if (password.length < 6) return '密码至少需要 6 位';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);

    if (isSignUp) {
      const { error } = await signUpWithEmail(email.trim(), password);
      setLoading(false);
      if (error) {
        setErrorMsg(error.message === 'User already registered'
          ? '该邮箱已注册，请直接登录'
          : `注册失败: ${error.message}`);
      } else {
        setSuccessMsg('注册成功！请检查邮箱完成验证（如无需验证则可直接登录）');
        setIsSignUp(false);
      }
    } else {
      const { error } = await signInWithEmail(email.trim(), password);
      setLoading(false);
      if (error) {
        setErrorMsg(error.message === 'Invalid login credentials'
          ? '邮箱或密码错误'
          : `登录失败: ${error.message}`);
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[300] animate-fade-in">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 弹窗 */}
      <div className="absolute inset-x-0 bottom-0 top-auto md:top-1/2 md:left-1/2 md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-[420px] bg-[var(--color-bg)] rounded-t-3xl md:rounded-2xl animate-modal-in overflow-hidden">
        <div className="px-6 py-5">
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* 标题 */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-extrabold text-[var(--color-text)]">
              {isSignUp ? '注册账号' : '登录账号'}
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              {isSignUp ? '注册后即可添加你的痛车' : '登录后才能添加和管理痛车'}
            </p>
          </div>

          {/* 切换标签 */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isSignUp
                  ? 'bg-white text-[var(--color-text)] shadow-sm'
                  : 'text-[var(--color-text-secondary)]'
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isSignUp
                  ? 'bg-white text-[var(--color-text)] shadow-sm'
                  : 'text-[var(--color-text-secondary)]'
              }`}
            >
              注册
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 位字符"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-[var(--color-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 错误/成功提示 */}
            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                <AlertCircleIcon className="w-3.5 h-3.5" />
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {successMsg}
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient flex items-center justify-center gap-2 py-3 text-sm disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                isSignUp ? '注册' : '登录'
              )}
            </button>
          </form>

          {/* 底部提示 */}
          <p className="text-[11px] text-[var(--color-text-secondary)] text-center mt-4">
            {isSignUp ? '已有账号？' : '还没有账号？'}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setSuccessMsg(''); }}
              className="text-[var(--color-primary)] font-medium ml-1 hover:underline"
            >
              {isSignUp ? '立即登录' : '立即注册'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
