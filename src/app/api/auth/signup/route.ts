import { NextRequest, NextResponse } from 'next/server';
import { signUpWithEmail, setAuthCookies } from '@/lib/supabase/direct';

// 部署到香港区域，确保能访问阿里云 ADB Supabase
export const preferredRegion = 'hkg1';

/**
 * 注册 API 路由
 *
 * 直接调用 Supabase Auth REST API，不依赖 @supabase/ssr SDK。
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

    const result = await signUpWithEmail(email, password);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // 如果自动登录，设置 cookie
    if (result.autoLogin && result.accessToken && result.refreshToken) {
      await setAuthCookies(result.accessToken, result.refreshToken);
      return NextResponse.json({
        user: result.user,
        autoLogin: true,
      });
    }

    // 没有 token，需要邮箱验证
    return NextResponse.json({
      user: null,
      autoLogin: false,
      message: '注册成功！请检查邮箱点击验证链接',
    });
  } catch (err) {
    console.error('[API /auth/signup] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '注册失败' },
      { status: 500 }
    );
  }
}
