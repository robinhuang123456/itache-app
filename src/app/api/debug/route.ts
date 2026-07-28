import { NextResponse } from 'next/server';

export const preferredRegion = 'hkg1';

/**
 * 调试端点 — 诊断 Vercel 到 Supabase 的连接问题
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const debug: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION || 'unknown',
    supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET',
    hasAnonKey: hasKey,
  };

  // 测试 1: 尝试 DNS 解析
  try {
    const url = new URL(supabaseUrl || 'https://example.com');
    debug.supabaseHost = url.hostname;

    // 尝试 fetch health endpoint
    const healthUrl = `${supabaseUrl}/auth/v1/health`;
    debug.healthUrl = healthUrl;

    const start = Date.now();
    const res = await fetch(healthUrl, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
      signal: AbortSignal.timeout(10000),
    });
    debug.healthStatus = res.status;
    debug.healthTime = `${Date.now() - start}ms`;

    try {
      const body = await res.text();
      debug.healthBody = body.substring(0, 200);
    } catch {}
  } catch (err) {
    debug.healthError = err instanceof Error ? err.message : String(err);
    debug.healthErrorType = err?.constructor?.name || 'unknown';
  }

  // 测试 2: 尝试直接 IP 连接
  try {
    const start2 = Date.now();
    const res2 = await fetch('https://42.121.181.8/auth/v1/health', {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Host': 'spb-g59e6i96hv8mciir.supabase.opentrust.net',
      },
      signal: AbortSignal.timeout(10000),
      // @ts-ignore - Node.js fetch supports this
      rejectUnauthorized: false,
    });
    debug.ipStatus = res2.status;
    debug.ipTime = `${Date.now() - start2}ms`;
  } catch (err) {
    debug.ipError = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json(debug);
}
