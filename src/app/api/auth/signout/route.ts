import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 部署到香港区域，确保能访问阿里云 ADB Supabase
export const preferredRegion = 'hkg1';

/**
 * 登出 API 路由
 *
 * 服务端清除 session cookie。
 */
export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  } catch {
    // 即使出错也返回成功，前端会清除本地状态
    return NextResponse.json({ success: true });
  }
}
