import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/supabase/direct';

// 部署到香港区域，确保能访问阿里云 ADB Supabase
export const preferredRegion = 'hkg1';

/**
 * 获取当前会话 API 路由
 *
 * 直接从 cookie 读取 token，调用 Supabase Auth API 验证。
 * 如果 access token 过期，自动用 refresh token 刷新。
 */
export async function GET() {
  try {
    const { user } = await getValidAccessToken();

    return NextResponse.json({
      user: user ? {
        id: user.id,
        email: user.email,
      } : null,
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
