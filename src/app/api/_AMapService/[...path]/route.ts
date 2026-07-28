import { NextRequest, NextResponse } from 'next/server';

// 部署到香港区域，确保能访问高德地图 API
export const preferredRegion = 'hkg1';

/**
 * 高德地图安全验证代理
 *
 * 蜂窝网络下 restapi.amap.com 可能被运营商拦截或限速，
 * 通过自有域名代理转发安全验证请求，确保移动端正常使用。
 *
 * 代理路径：/api/_AMapService/* → https://restapi.amap.com/v3/_AMapService/*
 */

const AMAP_REST_API = 'https://restapi.amap.com/v3';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/_AMapService', '');
  const search = request.nextUrl.search;
  const targetUrl = `${AMAP_REST_API}/_AMapService${path}${search}`;

  try {
    const res = await fetch(targetUrl, {
      headers: { 'Referer': request.headers.get('referer') || '' },
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'AMap proxy failed' }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/_AMapService', '');
  const targetUrl = `${AMAP_REST_API}/_AMapService${path}`;

  try {
    const body = await request.text();
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
        'Referer': request.headers.get('referer') || '',
      },
      body,
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'AMap proxy failed' }, { status: 502 });
  }
}
