import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 注册 API 路由
 *
 * 服务端完成注册，cookie 自动管理 session。
 * 若 ADB Supabase 关闭了 Confirm email，注册后自动登录。
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

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少需要 6 位' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      const msg = error.message === 'User already registered'
        ? '该邮箱已注册，请直接登录'
        : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // 如果返回了 session，说明 Confirm email 已关闭，自动登录
    if (data.session) {
      return NextResponse.json({
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
        } : null,
        autoLogin: true,
      });
    }

    // 没有 session，需要邮箱验证
    return NextResponse.json({
      user: null,
      autoLogin: false,
      message: '注册成功！请检查邮箱点击验证链接',
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '注册失败' },
      { status: 500 }
    );
  }
}
