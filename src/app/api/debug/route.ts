import { NextResponse } from 'next/server';

export const preferredRegion = 'hkg1';

/**
 * 调试端点 — 诊断 Vercel 到 Supabase 的连接问题
 */
export async function GET() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseUrl = rawUrl.trim();
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const debug: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION || 'unknown',
    rawUrlLength: rawUrl.length,
    trimmedUrlLength: supabaseUrl.length,
    hasTrailingWhitespace: rawUrl !== rawUrl.trim(),
    supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 40)}...` : 'NOT SET',
    hasAnonKey: hasKey,
  };

  // 测试 fetch health endpoint
  try {
    const healthUrl = `${supabaseUrl}/auth/v1/health`;
    debug.healthUrl = healthUrl;

    const start = Date.now();
    const res = await fetch(healthUrl, {
      headers: {
        'apikey': (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim(),
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
  }

  return NextResponse.json(debug);
}
