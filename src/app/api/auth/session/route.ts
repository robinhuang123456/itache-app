import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 获取当前会话 API 路由
 *
 * 浏览器端页面加载时调用，检查用户是否已登录。
 * 通过 HTTP-only cookie 读取 session，无需浏览器端 SDK。
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return NextResponse.json({ user: null });
    }

    const { data: { user } } = await supabase.auth.getUser();

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
