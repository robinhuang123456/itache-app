import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 登录 API 路由
 *
 * 浏览器端完全不接触 Supabase SDK，所有认证在服务端完成。
 * 服务端通过 HTTP-only cookie 自动管理 session token。
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      const msg = error.message === 'Invalid login credentials'
        ? '邮箱或密码错误'
        : error.message;
      return NextResponse.json({ error: msg }, { status: 401 });
    }

    // 登录成功，cookie 已由 createServerClient 自动设置
    return NextResponse.json({
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
      } : null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '登录失败' },
      { status: 500 }
    );
  }
}
