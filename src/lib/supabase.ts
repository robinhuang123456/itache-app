import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/** 获取当前浏览器端的 Supabase 客户端（用于 auth 操作） */
export function getSupabaseClient() {
  return supabase;
}
