import { NextResponse } from 'next/server';
import { dbSelect, getValidAccessToken } from '@/lib/supabase/direct';
import { mapRowToCar } from '@/lib/car-mapper';
import type { Car } from '@/lib/data';

// 部署到香港区域，确保能访问阿里云 ADB Supabase
export const preferredRegion = 'hkg1';

/**
 * 用户车辆 API 路由
 *
 * GET /api/cars/user - 获取当前登录用户添加的车辆
 *
 * 直接调用 Supabase REST API，不依赖 @supabase/ssr SDK。
 */

export async function GET() {
  try {
    const { user } = await getValidAccessToken();
    if (!user) {
      return NextResponse.json(
        { cars: [], error: '未登录' },
        { status: 401 }
      );
    }

    const { data, error } = await dbSelect('cars', {
      select: '*',
      filters: { user_id: user.id, is_user_added: true, is_demo: false },
      order: { column: 'created_at', ascending: false },
    });

    if (error) {
      console.error('[API /cars/user GET] 查询失败:', error);
      return NextResponse.json({ cars: [] });
    }

    const cars: Car[] = data
      ? data.map((row) => mapRowToCar(row))
      : [];

    return NextResponse.json({ cars });
  } catch (err) {
    console.error('[API /cars/user GET] 异常:', err);
    return NextResponse.json({ cars: [] });
  }
}
