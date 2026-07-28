import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Car } from '@/lib/data';

// 部署到香港区域，确保能访问阿里云 ADB Supabase
export const preferredRegion = 'hkg1';

/**
 * 单辆车辆 API 路由
 *
 * PUT    /api/cars/[id] - 更新车辆信息，需要登录
 * DELETE /api/cars/[id] - 删除车辆，需要登录
 */

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: carId } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const car: Car = await request.json();

    const { error } = await supabase
      .from('cars')
      .update({
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
        is_visible: car.isVisible,
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
      })
      .eq('id', carId);

    if (error) {
      console.error('[API /cars/[id] PUT] 更新失败:', error.message);
      return NextResponse.json(
        { error: `更新失败: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /cars/[id] PUT] 异常:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '更新失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: carId } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', carId);

    if (error) {
      console.error('[API /cars/[id] DELETE] 删除失败:', error.message);
      return NextResponse.json(
        { error: `删除失败: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /cars/[id] DELETE] 异常:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '删除失败' },
      { status: 500 }
    );
  }
}
