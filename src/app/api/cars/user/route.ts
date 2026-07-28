import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { mapRowToCar } from '@/lib/car-mapper';
import type { Car } from '@/lib/data';

/**
 * 用户车辆 API 路由
 *
 * GET /api/cars/user - 获取当前登录用户添加的车辆
 *
 * user_id 从服务端 session 获取，不依赖浏览器端传参。
 */

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { cars: [], error: '未登录' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_user_added', true)
      .eq('is_demo', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API /cars/user GET] 查询失败:', error.message);
      return NextResponse.json({ cars: [] });
    }

    const cars: Car[] = data
      ? data.map((row) => mapRowToCar(row as Record<string, unknown>))
      : [];

    return NextResponse.json({ cars });
  } catch (err) {
    console.error('[API /cars/user GET] 异常:', err);
    return NextResponse.json({ cars: [] });
  }
}
