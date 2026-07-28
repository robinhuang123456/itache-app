import { NextResponse } from 'next/server';

// 测试不同区域能否访问 Supabase
export const preferredRegion = 'sin1'; // 新加坡

export async function GET() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  const debug: Record<string, unknown> = {
    region: 'sin1',
    timestamp: new Date().toISOString(),
  };

  try {
    const start = Date.now();
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: { 'apikey': anonKey },
      signal: AbortSignal.timeout(8000),
    });
    debug.status = res.status;
    debug.time = `${Date.now() - start}ms`;
    debug.body = (await res.text()).substring(0, 100);
  } catch (err) {
    debug.error = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json(debug);
}
