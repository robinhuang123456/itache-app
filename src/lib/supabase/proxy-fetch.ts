/**
 * Supabase 代理 fetch
 *
 * 将浏览器到 Supabase 的直连请求改为通过自有域名代理转发。
 * 蜂窝网络下 Supabase 域名可能被运营商拦截，但 itasha.fun 可以正常访问。
 *
 * 原始请求：https://spb-xxx.supabase.opentrust.net/auth/v1/token
 * 代理请求：/api/supabase/auth/v1/token
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/**
 * 自定义 fetch：将 Supabase URL 重写为代理路径
 * 其他 URL 保持不变（如高德地图等）
 */
export function createProxyFetch(): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    // 获取请求 URL
    let url: string;
    if (input instanceof URL) {
      url = input.toString();
    } else if (typeof input === 'string') {
      url = input;
    } else {
      // Request 对象
      url = input.url;
    }

    // 如果是 Supabase 请求，重写为代理路径
    if (url.startsWith(SUPABASE_URL)) {
      // 提取路径部分：/auth/v1/token?grant_type=password
      const pathAndQuery = url.substring(SUPABASE_URL.length);
      const proxyUrl = `/api/supabase${pathAndQuery}`;

      // 如果是 Request 对象，需要保留原始 init
      if (typeof input !== 'string' && !(input instanceof URL)) {
        // Request 对象：创建新的 init 合并
        const mergedInit: RequestInit = {
          ...init,
          method: input.method,
          headers: input.headers,
          body: input.body,
          redirect: input.redirect,
        };
        return fetch(proxyUrl, mergedInit);
      }

      return fetch(proxyUrl, init);
    }

    // 非 Supabase 请求，直接使用原始 fetch
    return fetch(input, init);
  };
}
