import type { Car } from './data';

/**
 * 将 Supabase 数据库行映射为 Car 对象
 * 服务端 API 路由使用此函数统一转换数据格式
 */
export function mapRowToCar(row: Record<string, unknown>): Car {
  return {
    id: row.id as string,
    nickname: (row.nickname as string) || '匿名痛车人',
    brand: row.brand as string,
    model: row.model as string,
    ipTags: (row.ip_tags as string[]) || [],
    city: row.city as string,
    cityName: row.city_name as string,
    contactType: row.contact_type as 'wechat' | 'qq',
    contactValue: row.contact_value as string,
    contactType2: (row.contact_type2 as 'wechat' | 'qq') || undefined,
    contactValue2: (row.contact_value2 as string) || undefined,
    photos: (row.photos as string[]) || [],
    lat: row.lat as number,
    lng: row.lng as number,
    isVisible: row.is_visible !== false,
    createdAt: (row.created_at as string)?.split('T')[0] || new Date().toISOString().split('T')[0],
    province: (row.province as string) || undefined,
    district: (row.district as string) || undefined,
    avatar: (row.avatar as string) || undefined,
    bio: (row.bio as string) || undefined,
    hobbies: (row.hobbies as string[]) || undefined,
    gender: (row.gender as 'male' | 'female') || undefined,
    occupation: (row.occupation as string) || undefined,
    isDemo: (row.is_demo as boolean) || false,
    costRange: (row.cost_range as string) || undefined,
    shopName: (row.shop_name as string) || undefined,
    designSource: (row.design_source as string) || undefined,
  };
}
