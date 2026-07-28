import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { mapRowToCar } from '@/lib/car-mapper';
import type { Car } from '@/lib/data';

// 部署到香港区域，确保能访问阿里云 ADB Supabase
export const preferredRegion = 'hkg1';

/**
 * 车辆数据 API 路由
 *
 * GET  /api/cars      - 获取所有车辆（demo + 用户添加），无需登录
 * POST /api/cars      - 保存新车辆，需要登录
 *
 * 服务端直连 Supabase，不受蜂窝网络运营商限制。
 */

export async function GET() {
  try {
    const supabase = await createClient();

    // 并行加载 demo 车辆和用户车辆
    const [demoResult, userResult] = await Promise.all([
      supabase
        .from('cars')
        .select('*')
        .eq('is_demo', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('cars')
        .select('*')
        .eq('is_user_added', true)
        .eq('is_demo', false)
        .order('created_at', { ascending: false }),
    ]);

    const demoCars: Car[] = demoResult.data
      ? demoResult.data.map((row) => mapRowToCar(row as Record<string, unknown>))
      : [];
    const userCars: Car[] = userResult.data
      ? userResult.data.map((row) => mapRowToCar(row as Record<string, unknown>))
      : [];

    const allCars = [...demoCars, ...userCars];

    return NextResponse.json({ cars: allCars });
  } catch (err) {
    console.error('[API /cars GET] 失败:', err);
    return NextResponse.json(
      { cars: [], error: '获取车辆数据失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: '请先登录后再添加痛车' },
        { status: 401 }
      );
    }

    const car: Car = await request.json();

    const { error } = await supabase.from('cars').insert({
      id: car.id,
      user_id: user.id,
      nickname: car.nickname,
      brand: car.brand,
      model: car.model,
      ip_tags: car.ipTags,
      city: car.city,
      city_name: car.cityName,
      contact_type: car.contactType,
      contact_value: car.contactValue,
      contact_type2: car.contactType2 || null,
      contact_value2: car.contactValue2 || null,
      photos: car.photos,
      lat: car.lat,
      lng: car.lng,
      is_visible: true,
      is_user_added: true,
      is_demo: false,
      created_at: car.createdAt,
      province: car.province || null,
      district: car.district || null,
      avatar: car.avatar || null,
      bio: car.bio || null,
      hobbies: car.hobbies || null,
      gender: car.gender || null,
      occupation: car.occupation || null,
      cost_range: car.costRange || null,
      shop_name: car.shopName || null,
      design_source: car.designSource || null,
    });

    if (error) {
      console.error('[API /cars POST] 保存失败:', error.message);
      return NextResponse.json(
        { error: `保存失败: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /cars POST] 异常:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '保存失败' },
      { status: 500 }
    );
  }
}
