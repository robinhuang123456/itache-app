'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  filterCars,
  getCarsByCity,
  getCityGroups,
  type Car,
} from '@/lib/data';
import { useAMap } from '@/lib/useAMap';
import { ArrowLeft, MapPin, Loader2, AlertCircle } from 'lucide-react';
import CarCard from './CarCard';

interface MapViewProps {
  allCars: Car[];
  searchQuery: string | null;
  onCityChange?: (cityId: string | null, cityName: string | null) => void;
}

// 车辆图片标记点的 HTML 内容
function createMarkerContent(car: Car, isActive: boolean = false): string {
  const photo = car.photos?.[0] || '';
  const borderColor = isActive ? '#ec4899' : '#7c3aed';
  const shadowColor = isActive ? 'rgba(236,72,153,0.4)' : 'rgba(124,58,237,0.4)';
  return `<div style="
    width: 40px;
    height: 48px;
    position: relative;
    cursor: pointer;
  ">
    <img src="${photo}" style="
      width: 36px;
      height: 36px;
      border-radius: 8px;
      object-fit: cover;
      border: 2.5px solid ${borderColor};
      box-shadow: 0 2px 8px ${shadowColor};
      background: #f3f4f6;
    " onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
    <div style="
      display: none;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, ${borderColor}, #ec4899);
      border: 2.5px solid #fff;
      box-shadow: 0 2px 8px ${shadowColor};
      align-items: center;
      justify-content: center;
      font-size: 16px;
    ">🚗</div>
    <div style="
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 8px solid ${borderColor};
    "></div>
  </div>`;
}

// 城市聚合标记的 HTML 内容
function createClusterContent(count: number): string {
  const size = count > 5 ? 48 : count > 2 ? 42 : 36;
  return `<div style="
    width: ${size}px;
    height: ${size}px;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    box-shadow: 0 2px 12px rgba(124, 58, 237, 0.35);
    border: 2px solid #fff;
    cursor: pointer;
  ">${count}</div>`;
}

export default function MapView({ allCars, searchQuery, onCityChange }: MapViewProps) {
  const { ready, error } = useAMap();
  const [mapReady, setMapReady] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [cardPos, setCardPos] = useState<{ x: number; y: number } | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const cityMarkersRef = useRef<any[]>([]);

  const filteredCars = useMemo(
    () => filterCars(allCars, null, null, null, searchQuery),
    [allCars, searchQuery]
  );

  const cityGroups = useMemo(() => getCityGroups(filteredCars), [filteredCars]);

  const cityCars = useMemo(
    () => (selectedCity ? getCarsByCity(filteredCars, selectedCity) : []),
    [filteredCars, selectedCity]
  );

  // 初始化地图
  useEffect(() => {
    if (!ready || !mapRef.current || mapInstanceRef.current) return;

    const AMap = window.AMap;

    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    // 使用 requestAnimationFrame 确保容器布局完成后再初始化地图
    const initTimer = requestAnimationFrame(() => {
      if (!mapRef.current || mapInstanceRef.current) return;

      mapInstanceRef.current = new AMap.Map(mapRef.current, {
        zoom: 4,
        center: [105, 35],
        mapStyle: 'amap://styles/whitesmoke',
        features: ['bg', 'road', 'building'],
        viewMode: '2D',
        resizeEnable: true,
      });

      mapInstanceRef.current.addControl(new AMap.Scale());

      // 监听地图完全加载完成事件后再渲染marker
      // 蜂窝网络下地图内部模块加载较慢，立即添加marker可能失败
      let completeHandled = false;
      const onComplete = () => {
        if (completeHandled) return;
        completeHandled = true;
        setMapReady(true);
      };
      mapInstanceRef.current.on('complete', onComplete);

      // 超时兜底：8秒后强制设置为ready，防止complete事件不触发
      fallbackTimer = setTimeout(onComplete, 8000);
    });

    return () => {
      cancelAnimationFrame(initTimer);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [ready]);

  // 全国视图：显示城市聚合标记
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || selectedCity) return;
    const AMap = window.AMap;
    const map = mapInstanceRef.current;

    // 清除旧标记
    cityMarkersRef.current.forEach((m) => map.remove(m));
    cityMarkersRef.current = [];

    // 为每个有车辆的城市分组添加聚合标记
    cityGroups.forEach((group) => {
      const marker = new AMap.Marker({
        position: [group.lng, group.lat],
        content: createClusterContent(group.count),
        offset: new AMap.Pixel(-24, -24),
        zIndex: 110,
      });

      marker.on('click', () => {
        setSelectedCity(group.id);
        setSelectedCar(null);
      });

      map.add(marker);
      cityMarkersRef.current.push(marker);
    });
  }, [mapReady, cityGroups, selectedCity]);

  // 城市视图：显示该城市的具体车辆标记
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    const AMap = window.AMap;
    const map = mapInstanceRef.current;

    if (!selectedCity) {
      // 返回全国视图：清除车辆标记，恢复缩放
      markersRef.current.forEach((m) => map.remove(m));
      markersRef.current = [];
      map.setZoomAndCenter(4, [105, 35]);
      return;
    }

    // 清除全国视图的城市标记
    cityMarkersRef.current.forEach((m) => map.remove(m));
    cityMarkersRef.current = [];

    // 清除旧车辆标记
    markersRef.current.forEach((m) => map.remove(m));
    markersRef.current = [];

    // 添加该城市的车辆标记
    const group = cityGroups.find((g) => g.id === selectedCity);
    if (!group) return;

    cityCars.forEach((car) => {
      const marker = new AMap.Marker({
        position: [car.lng, car.lat],
        content: createMarkerContent(car),
        offset: new AMap.Pixel(-20, -48),
        zIndex: 120,
      });

      marker.on('click', () => {
        const pixel = map.lngLatToContainer(new AMap.LngLat(car.lng, car.lat));
        setCardPos({ x: pixel.getX(), y: pixel.getY() });
        setSelectedCar(car);
      });

      map.add(marker);
      markersRef.current.push(marker);
    });

    // 自动调整视野到该城市
    if (cityCars.length > 0) {
      map.setZoomAndCenter(11, [group.lng, group.lat]);
    } else {
      map.setZoomAndCenter(10, [group.lng, group.lat]);
    }
  }, [mapReady, selectedCity, cityCars, cityGroups]);

  // 清理
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 通知父组件城市变化
  useEffect(() => {
    if (onCityChange) {
      const group = cityGroups.find((g) => g.id === selectedCity);
      onCityChange(selectedCity, group?.name || null);
    }
  }, [selectedCity, cityGroups, onCityChange]);

  const handleBack = useCallback(() => {
    setSelectedCity(null);
    setSelectedCar(null);
  }, []);

  const handleCarClose = useCallback(() => {
    setSelectedCar(null);
    setCardPos(null);
  }, []);

  // 加载中状态
  if (!ready && !error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#e8e4f0] via-[#f0ecf8] to-[#e0d8f0]">
        <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin mb-3" />
        <p className="text-sm text-[var(--color-text-secondary)]">正在加载高德地图...</p>
      </div>
    );
  }

  // 加载失败状态
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#e8e4f0] via-[#f0ecf8] to-[#e0d8f0]">
        <AlertCircle className="w-10 h-10 text-[var(--color-secondary)] mb-3" />
        <p className="text-sm font-medium text-[var(--color-text)] mb-1">地图加载失败</p>
        <p className="text-xs text-[var(--color-text-secondary)]">{error}</p>
        <p className="text-xs text-[var(--color-text-secondary)] mt-2">请检查网络连接后刷新页面</p>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden min-h-0" style={{ height: '100%' }}>
      {/* 高德地图容器 */}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* 返回全国视图按钮 */}
      {selectedCity && (
        <button
          onClick={handleBack}
          className="absolute top-3 left-3 z-[200] glass rounded-full w-9 h-9 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--color-text)]" />
        </button>
      )}

      {/* 城市名标题 */}
      {selectedCity && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[200] glass rounded-full px-4 py-1.5 shadow-sm">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="text-sm font-bold text-[var(--color-text)]">
              {cityGroups.find((g) => g.id === selectedCity)?.name}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {cityCars.length} 辆痛车
            </span>
          </div>
        </div>
      )}

      {/* 车辆信息卡片 */}
      {selectedCar && <CarCard car={selectedCar} onClose={handleCarClose} />}

      {/* 全国统计信息 */}
      {!selectedCity && (
        <div className="absolute bottom-4 left-4 z-[200] glass rounded-xl px-3 py-2 shadow-sm">
          <div className="text-xs text-[var(--color-text-secondary)]">
            全国 <span className="font-bold text-[var(--color-primary)]">{filteredCars.length}</span> 辆痛车
            <span className="mx-1.5">|</span>
            覆盖{' '}
            <span className="font-bold text-[var(--color-secondary)]">
              {cityGroups.length}
            </span>{' '}
            个城市
          </div>
        </div>
      )}

      {/* 图例 */}
      {!selectedCity && (
        <div className="absolute bottom-4 right-4 z-[200] glass rounded-xl px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-secondary)]">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
            />
            <span>点击城市查看痛车</span>
          </div>
        </div>
      )}

      {/* 城市视图下无车辆提示 */}
      {selectedCity && cityCars.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <MapPin className="w-12 h-12 mb-3 opacity-20 text-[var(--color-text-secondary)]" />
          <p className="text-sm text-[var(--color-text-secondary)]">该城市暂无匹配的痛车</p>
          <p className="text-xs mt-1 text-[var(--color-text-secondary)]">试试切换筛选条件</p>
        </div>
      )}
    </div>
  );
}
