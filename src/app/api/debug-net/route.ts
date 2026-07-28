import { NextResponse } from 'next/server';

export const preferredRegion = 'hkg1';

/**
 * 测试 Vercel 能否访问中国服务器（百度、阿里云）
 */
export async function GET() {
  const results: Record<string, unknown> = {
    region: 'hkg1',
    timestamp: new Date().toISOString(),
  };

  // 测试 1: 百度
  try {
    const start = Date.now();
    const res = await fetch('https://www.baidu.com', {
      signal: AbortSignal.timeout(8000),
      redirect: 'manual',
    });
    results.baidu = { status: res.status, time: `${Date.now() - start}ms` };
  } catch (err) {
    results.baidu = { error: err instanceof Error ? err.message : String(err) };
  }

  // 测试 2: Supabase 服务器 IP 直接访问
  try {
    const start = Date.now();
    const res = await fetch('https://42.121.181.8/auth/v1/health', {
      headers: {
        'apikey': (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim(),
        'Host': 'spb-g59e6i96hv8mciir.supabase.opentrust.net',
      },
      signal: AbortSignal.timeout(8000),
    });
    results.supabaseIP = { status: res.status, time: `${Date.now() - start}ms` };
  } catch (err) {
    results.supabaseIP = { error: err instanceof Error ? err.message : String(err) };
  }

  // 测试 3: 阿里云其他服务
  try {
    const start = Date.now();
    const res = await fetch('https://www.aliyun.com', {
      signal: AbortSignal.timeout(8000),
      redirect: 'manual',
    });
    results.aliyun = { status: res.status, time: `${Date.now() - start}ms` };
  } catch (err) {
    results.aliyun = { error: err instanceof Error ? err.message : String(err) };
  }

  return NextResponse.json(results);
}
