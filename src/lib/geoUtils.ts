/**
 * 高德地图地理编码工具
 * 将省市区地址文本转换为经纬度坐标
 */

import { loadAMapScript } from './useAMap';

export interface GeoResult {
  lat: number;
  lng: number;
}

let geocoderInstance: any = null;

/**
 * 获取或创建 AMap.Geocoder 实例
 */
async function getGeocoder(): Promise<any> {
  if (geocoderInstance) return geocoderInstance;

  const AMap = await loadAMapScript();
  if (!AMap.Geocoder) {
    throw new Error('Geocoder 插件未加载');
  }
  geocoderInstance = new AMap.Geocoder({
    city: '全国',
    radius: 1000,
  });
  return geocoderInstance;
}

/**
 * 将地址文本转换为经纬度坐标
 * @param address 完整地址（如 "广东省深圳市南山区"）
 * @returns 经纬度，失败时返回 null
 */
export async function geocodeAddress(address: string): Promise<GeoResult | null> {
  try {
    const geocoder = await getGeocoder();

    return new Promise((resolve) => {
      geocoder.getLocation(address, (status: string, result: any) => {
        if (status === 'complete' && result.info === 'OK' && result.geocodes?.length > 0) {
          const geo = result.geocodes[0];
          resolve({
            lat: geo.location.getLat(),
            lng: geo.location.getLng(),
          });
        } else {
          resolve(null);
        }
      });
    });
  } catch {
    return null;
  }
}

/**
 * 从省市区名称构建完整地址
 */
export function buildAddress(province: string, city: string, district: string): string {
  return [province, city, district].filter(Boolean).join('');
}

/**
 * 从城市名称提取简短名称（去掉"市"后缀）
 */
export function shortenCityName(cityName: string): string {
  if (!cityName) return '';
  // 去掉末尾的"市"字
  if (cityName.endsWith('市')) {
    return cityName.slice(0, -1);
  }
  return cityName;
}
