import { NextResponse } from 'next/server';
import { getValidAccessToken, signOut, clearAuthCookies } from '@/lib/supabase/direct';

// 部署到香港区域，确保能访问阿里云 ADB Supabase
export const preferredRegion = 'hkg1';

/**
 * 登出 API 路由
 *
 * 调用 Supabase Auth API 注销 token，清除 cookie。
 */
export async function POST() {
  try {
    const { token } = await getValidAccessToken();
    if (token) {
      await signOut(token);
    }
  } catch {
    // 忽略错误
  }

  await clearAuthCookies();
  return NextResponse.json({ success: true });
}
