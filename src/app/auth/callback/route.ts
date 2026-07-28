import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/supabase/direct';

export const preferredRegion = 'hkg1';

/**
 * OAuth 回调路由
 *
 * 由于已改为邮箱密码认证（不使用 OAuth），
 * 此路由仅做重定向，清除可能残留的 cookie。
 */
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  await clearAuthCookies();
  return NextResponse.redirect(`${origin}/?auth=callback`);
}
