import { NextResponse } from 'next/server';

// Edge Runtime 运行在 Cloudflare 全球边缘网络，可能比 Vercel hkg1 更好地连接中国服务器
export const runtime = 'edge';

/**
 * Edge 调试端点 — 测试 Edge Runtime 能否访问 Supabase
 */
export async function GET() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  const debug: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    runtime: 'edge',
    supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 40)}...` : 'NOT SET',
    hasAnonKey: !!anonKey,
  };

  // 测试 fetch health endpoint
  try {
    const healthUrl = `${supabaseUrl}/auth/v1/health`;
    const start = Date.now();
    const res = await fetch(healthUrl, {
      headers: { 'apikey': anonKey },
      signal: AbortSignal.timeout(10000),
    });
    debug.healthStatus = res.status;
    debug.healthTime = `${Date.now() - start}ms`;
    const body = await res.text();
    debug.healthBody = body.substring(0, 200);
  } catch (err) {
    debug.healthError = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json(debug);
}
