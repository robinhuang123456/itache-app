import { NextRequest, NextResponse } from 'next/server';

/**
 * Supabase 代理路由
 *
 * 蜂窝网络下 Supabase 域名 (supabase.opentrust.net) 可能被运营商
 * DNS 污染、QoS 限速或 IP 拦截，导致注册/登录请求超时。
 *
 * 通过自有域名代理转发所有 Supabase API 请求（auth + rest），
 * 浏览器只和 itasha.fun 通信，由 Vercel 服务器转发到 Supabase。
 *
 * 代理路径：/api/supabase/* → {SUPABASE_URL}/*
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// 需要转发的请求方法
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

// 不转发的请求头（这些由 fetch 自动设置）
const SKIP_HEADERS = new Set(['host', 'connection', 'content-length', 'transfer-encoding']);

async function proxyRequest(request: NextRequest, method: string) {
  // 提取路径：/api/supabase/auth/v1/token → /auth/v1/token
  const path = request.nextUrl.pathname.replace('/api/supabase', '');
  const search = request.nextUrl.search;
  const targetUrl = `${SUPABASE_URL}${path}${search}`;

  // 转发请求头
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
    });

    // 读取响应
    const data = await res.arrayBuffer();

    // 构建响应头
    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      // 跳过 transfer-encoding，NextResponse 会自动处理
      if (key.toLowerCase() !== 'transfer-encoding') {
        responseHeaders[key] = value;
      }
    });

    // 允许跨域（虽然同源不需要，但保险起见）
    responseHeaders['Access-Control-Allow-Origin'] = '*';

    return new NextResponse(data, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error('[Supabase Proxy] 转发失败:', err);
    return NextResponse.json(
      { error: 'Supabase proxy request failed' },
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

// 处理 CORS 预检请求
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
