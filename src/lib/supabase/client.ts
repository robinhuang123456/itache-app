import { createBrowserClient } from '@supabase/ssr';

/**
 * 浏览器端 Supabase 客户端
 *
 * 蜂窝网络下 Supabase 域名 (supabase.opentrust.net) 被运营商拦截，
 * 浏览器端使用 /api/supabase 代理路径作为 base URL。
 * 服务端（SSR）使用真实 URL，因为 Vercel 服务器不受运营商限制。
 */
function getSupabaseUrl() {
  // 浏览器端：使用自有域名代理
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/supabase`;
  }
  // 服务端 SSR：直连真实 Supabase URL
  return process.env.NEXT_PUBLIC_SUPABASE_URL!;
}

export function createClient() {
  return createBrowserClient(
    getSupabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
