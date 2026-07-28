import { NextResponse } from 'next/server';
import { getValidAccessToken, signOut, clearAuthCookies } from '@/lib/supabase/direct';

export const preferredRegion = 'hkg1';

/**
 * 遗留登出路由 — 重定向到 /api/auth/signout
 * 直接调用 Supabase Auth REST API 注销 token。
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
