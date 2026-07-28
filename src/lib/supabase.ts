import { createBrowserClient } from '@supabase/ssr';

/**
 * 浏览器端 Supabase 客户端（用于 data.ts 的数据操作）
 *
 * 蜂窝网络下 Supabase 域名被运营商拦截，
 * 浏览器端使用 /api/supabase 代理路径，服务端直连。
 */
function getSupabaseUrl() {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/supabase`;
  }
  return process.env.NEXT_PUBLIC_SUPABASE_URL!;
}

export const supabase = createBrowserClient(
  getSupabaseUrl(),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/** 获取当前浏览器端的 Supabase 客户端（用于 auth 操作） */
export function getSupabaseClient() {
  return supabase;
}
