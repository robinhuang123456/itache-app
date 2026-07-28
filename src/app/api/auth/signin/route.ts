import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmail, setAuthCookies } from '@/lib/supabase/direct';

// 部署到香港区域，确保能访问阿里云 ADB Supabase
export const preferredRegion = 'hkg1';

/**
 * 登录 API 路由
 *
 * 直接调用 Supabase Auth REST API，不依赖 @supabase/ssr SDK。
 * 登录成功后将 token 写入 HTTP-only cookie。
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

    const result = await signInWithEmail(email, password);

    if (result.error || !result.user) {
      return NextResponse.json(
        { error: result.error || '登录失败' },
        { status: 401 }
      );
    }

    // 设置认证 cookie
    if (result.accessToken && result.refreshToken) {
      await setAuthCookies(result.accessToken, result.refreshToken);
    }

    return NextResponse.json({
      user: result.user,
    });
  } catch (err) {
    console.error('[API /auth/signin] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '登录失败' },
      { status: 500 }
    );
  }
}
