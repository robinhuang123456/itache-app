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
 * 常见城市坐标映射表（省/直辖市 → 经纬度）
 * 当高德 Geocoder API 不可用时作为 fallback
 */
const CITY_COORDS: Record<string, GeoResult> = {
  // 直辖市
  '北京市': { lat: 39.9042, lng: 116.4074 },
  '天津市': { lat: 39.0842, lng: 117.2009 },
  '上海市': { lat: 31.2304, lng: 121.4737 },
  '重庆市': { lat: 29.5630, lng: 106.5516 },
  // 广东省
  '广州市': { lat: 23.1291, lng: 113.2644 },
  '深圳市': { lat: 22.5431, lng: 114.0579 },
  '东莞市': { lat: 23.0208, lng: 113.7518 },
  '佛山市': { lat: 23.0218, lng: 113.1219 },
  '珠海市': { lat: 22.2710, lng: 113.5767 },
  '惠州市': { lat: 23.1115, lng: 114.4165 },
  '中山市': { lat: 22.5176, lng: 113.3926 },
  // 浙江省
  '杭州市': { lat: 30.2741, lng: 120.1551 },
  '宁波市': { lat: 29.8683, lng: 121.5440 },
  '温州市': { lat: 28.0001, lng: 120.6725 },
  '嘉兴市': { lat: 30.7469, lng: 120.7555 },
  '绍兴市': { lat: 30.0000, lng: 120.5833 },
  '金华市': { lat: 29.0785, lng: 119.6494 },
  // 江苏省
  '南京市': { lat: 32.0603, lng: 118.7969 },
  '苏州市': { lat: 31.2989, lng: 120.5853 },
  '无锡市': { lat: 31.4912, lng: 120.3119 },
  '常州市': { lat: 31.8106, lng: 119.9741 },
  '南通市': { lat: 32.0146, lng: 120.8730 },
  '扬州市': { lat: 32.3932, lng: 119.4129 },
  // 四川省
  '成都市': { lat: 30.5728, lng: 104.0668 },
  '绵阳市': { lat: 31.4675, lng: 104.6796 },
  '德阳市': { lat: 31.1271, lng: 104.3981 },
  // 湖北省
  '武汉市': { lat: 30.5928, lng: 114.3055 },
  '宜昌市': { lat: 30.6918, lng: 111.2864 },
  '襄阳市': { lat: 32.0420, lng: 112.1440 },
  // 湖南省
  '长沙市': { lat: 28.2282, lng: 112.9388 },
  '株洲市': { lat: 27.8274, lng: 113.1340 },
  // 福建省
  '福州市': { lat: 26.0745, lng: 119.2965 },
  '厦门市': { lat: 24.4798, lng: 118.0894 },
  '泉州市': { lat: 24.8741, lng: 118.6758 },
  // 山东省
  '济南市': { lat: 36.6512, lng: 117.1201 },
  '青岛市': { lat: 36.0671, lng: 120.3826 },
  '烟台市': { lat: 37.4638, lng: 121.4479 },
  // 河南省
  '郑州市': { lat: 34.7466, lng: 113.6253 },
  '洛阳市': { lat: 34.6197, lng: 112.4540 },
  // 河北省
  '石家庄市': { lat: 38.0428, lng: 114.5149 },
  '保定市': { lat: 38.8739, lng: 115.4646 },
  // 辽宁省
  '沈阳市': { lat: 41.8057, lng: 123.4315 },
  '大连市': { lat: 38.9140, lng: 121.6147 },
  // 吉林省
  '长春市': { lat: 43.8171, lng: 125.3235 },
  // 黑龙江省
  '哈尔滨市': { lat: 45.8038, lng: 126.5350 },
  // 陕西省
  '西安市': { lat: 34.3416, lng: 108.9398 },
  // 山西省
  '太原市': { lat: 37.8706, lng: 112.5489 },
  // 安徽省
  '合肥市': { lat: 31.8206, lng: 117.2272 },
  '芜湖市': { lat: 31.3340, lng: 118.3722 },
  // 江西省
  '南昌市': { lat: 28.6820, lng: 115.8579 },
  // 广西壮族自治区
  '南宁市': { lat: 22.8170, lng: 108.3665 },
  // 云南省
  '昆明市': { lat: 25.0389, lng: 102.7183 },
  // 贵州省
  '贵阳市': { lat: 26.6470, lng: 106.6302 },
  // 甘肃省
  '兰州市': { lat: 36.0611, lng: 103.8343 },
  // 内蒙古自治区
  '呼和浩特市': { lat: 40.8424, lng: 111.7490 },
  // 新疆维吾尔自治区
  '乌鲁木齐市': { lat: 43.8256, lng: 87.6168 },
  // 西藏自治区
  '拉萨市': { lat: 29.6500, lng: 91.1000 },
  // 海南省
  '海口市': { lat: 20.0440, lng: 110.1999 },
  '三亚市': { lat: 18.2528, lng: 109.5120 },
  // 宁夏回族自治区
  '银川市': { lat: 38.4872, lng: 106.2309 },
  // 青海省
  '西宁市': { lat: 36.6171, lng: 101.7782 },
};

/**
 * 根据城市名称从坐标映射表获取坐标
 */
function getCityCoordFallback(cityName: string): GeoResult | null {
  return CITY_COORDS[cityName] || null;
}

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
 * 优先使用高德 Geocoder API，失败时降级到城市坐标映射表
 * @param address 完整地址（如 "广东省深圳市南山区"）
 * @param cityName 城市名称（如 "深圳市"），用于 fallback 查找
 * @returns 经纬度
 */
export async function geocodeAddress(address: string, cityName?: string): Promise<GeoResult | null> {
  try {
    const geocoder = await getGeocoder();

    const result = await new Promise<GeoResult | null>((resolve) => {
      // 5秒超时
      const timer = setTimeout(() => resolve(null), 5000);

      geocoder.getLocation(address, (status: string, result: any) => {
        clearTimeout(timer);
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

    // 高德 API 成功，直接返回
    if (result) return result;

    // 高德 API 失败，降级到城市坐标映射
    if (cityName) {
      const fallback = getCityCoordFallback(cityName);
      if (fallback) {
        console.warn(`[geocode] 高德 API 失败，使用城市坐标 fallback: ${cityName}`);
        return fallback;
      }
    }
    return null;
  } catch {
    // 异常时也尝试 fallback
    if (cityName) {
      return getCityCoordFallback(cityName);
    }
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
