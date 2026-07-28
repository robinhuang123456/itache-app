import { createBrowserClient } from '@supabase/ssr';
import { createProxyFetch } from './proxy-fetch';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // 通过自有域名代理所有 Supabase 请求
      // 蜂窝网络下 Supabase 域名可能被运营商拦截，代理确保移动端正常使用
      global: {
        fetch: createProxyFetch(),
      },
    }
  );
}
