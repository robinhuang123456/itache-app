import { NextRequest, NextResponse } from 'next/server';

/**
 * Supabase 代理路由
 *
 * 蜂窝网络下 Supabase 域名 (supabase.opentrust.net) 被运营商
 * DNS 污染、QoS 限速或 IP 拦截，导致注册/登录请求超时。
 *
 * 浏览器端使用 /api/supabase 作为 base URL，所有请求通过 Vercel 转发。
 * 服务端不受运营商限制，可以正常访问 Supabase。
 *
 * 代理路径：/api/supabase/* → {SUPABASE_URL}/*
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// 不转发的 hop-by-hop 请求头
const SKIP_HEADERS = new Set([
  'host',
  'connection',
  'content-length',
  'transfer-encoding',
  'keep-alive',
]);

async function proxyRequest(request: NextRequest, method: string) {
  // 提取路径：/api/supabase/auth/v1/token → /auth/v1/token
  const path = request.nextUrl.pathname.replace('/api/supabase', '');
  const search = request.nextUrl.search;
  const targetUrl = `${SUPABASE_URL}${path}${search}`;

  // 转发请求头（保留 apikey、authorization、content-type 等）
  const forwardHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    if (!SKIP_HEADERS.has(key.toLowerCase())) {
      forwardHeaders[key] = value;
    }
  });

  // 读取请求体
  let body: BodyInit | undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    body = await request.text();
  }

  try {
    const res = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body,
      // 不自动跟随重定向，让浏览器处理
      redirect: 'manual',
    });

    // 读取响应体
    const data = await res.arrayBuffer();

    // 构建响应头，保留 Set-Cookie 等关键头
    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      // 跳过 transfer-encoding（由 NextResponse 处理）
      if (lowerKey !== 'transfer-encoding') {
        responseHeaders[key] = value;
      }
    });

    return new NextResponse(data, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error('[Supabase Proxy] 转发失败:', path, err);
    return NextResponse.json(
      {
        error: 'Supabase proxy request failed',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, 'PUT');
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request, 'PATCH');
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, 'DELETE');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
