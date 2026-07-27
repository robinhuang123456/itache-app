'use client';

import { useState, useMemo } from 'react';
import type { Car } from '@/lib/data';
import { aggregateShops, type ShopInfo } from '@/lib/data';
import { X, MapPin, Store, ImageOff } from 'lucide-react';
import CarCard from './CarCard';

interface ShopsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cars: Car[];
  currentCityId?: string | null;
  currentCityName?: string | null;
}

export default function ShopsModal({ isOpen, onClose, cars, currentCityId, currentCityName }: ShopsModalProps) {
  const [selectedShop, setSelectedShop] = useState<ShopInfo | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const shops = useMemo(() => {
    const allShops = aggregateShops(cars);
    if (currentCityId) {
      return allShops.filter((s) => s.city === currentCityId);
    }
    return allShops;
  }, [cars, currentCityId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] animate-fade-in">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 弹窗内容 */}
      <div className="absolute inset-x-0 bottom-0 top-12 bg-[var(--color-bg)] rounded-t-3xl animate-modal-in overflow-hidden flex flex-col">
        {/* 顶部 */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <button
            onClick={() => {
              if (selectedCar) {
                setSelectedCar(null);
              } else if (selectedShop) {
                setSelectedShop(null);
              } else {
                onClose();
              }
            }}
            className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-base font-bold">
            {selectedCar ? '案例详情' : selectedShop ? selectedShop.name : '同城痛车店铺'}
          </h2>
          <div className="w-8" />
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {selectedCar ? (
            <div className="pb-20">
              <CarCard car={selectedCar} onClose={() => setSelectedCar(null)} />
            </div>
          ) : selectedShop ? (
            /* 店铺详情：展示该店铺的所有案例 */
            <div className="space-y-4 pb-20">
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <MapPin className="w-4 h-4" />
                <span>{selectedShop.cityName}</span>
                <span className="text-[var(--color-border)]">·</span>
                <span>{selectedShop.caseCount} 个案例</span>
              </div>

              {/* 价位区间 */}
              {selectedShop.costRanges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-[var(--color-text-secondary)]">参考价位：</span>
                  {selectedShop.costRanges.map((r) => (
                    <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                      {r}
                    </span>
                  ))}
                </div>
              )}

              {/* 设计来源 */}
              {selectedShop.designSources.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-[var(--color-text-secondary)]">设计来源：</span>
                  {selectedShop.designSources.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* 案例网格 */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {selectedShop.cases.map((car) => (
                  <button
                    key={car.id}
                    onClick={() => setSelectedCar(car)}
                    className="text-left bg-white rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-[4/3] bg-gray-100">
                      {car.photos[0] ? (
                        <img
                          src={car.photos[0]}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageOff className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 space-y-1">
                      <div className="text-sm font-bold text-[var(--color-text)] truncate">
                        {car.brand} {car.model}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {car.ipTags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {car.costRange && (
                        <div className="text-xs text-amber-600">💰 {car.costRange}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* 店铺列表 */
            <div className="space-y-3 pb-20">
              {shops.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-secondary)]">
                  <Store className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">暂无店铺数据</p>
                  <p className="text-xs mt-1 opacity-60">
                    {currentCityName ? `${currentCityName}还没有车友分享施工店铺信息` : '还没有车友分享施工店铺信息'}
                  </p>
                  <p className="text-xs mt-2 opacity-50">添加痛车时填写「制作信息」，即可帮助其他车友</p>
                </div>
              ) : (
                shops.map((shop) => (
                  <button
                    key={`${shop.name}_${shop.city}`}
                    onClick={() => setSelectedShop(shop)}
                    className="w-full text-left bg-white rounded-xl border border-[var(--color-border)] p-4 hover:shadow-md hover:border-[var(--color-primary-light)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-[var(--color-text)] truncate">
                          {shop.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[var(--color-text-secondary)]">
                          <MapPin className="w-3 h-3" />
                          <span>{shop.cityName}</span>
                          <span className="text-[var(--color-border)]">·</span>
                          <span>{shop.caseCount} 个案例</span>
                        </div>
                      </div>
                      {/* 案例缩略图预览 */}
                      <div className="flex -space-x-2 shrink-0">
                        {shop.cases.slice(0, 3).map((car, idx) => (
                          <div
                            key={car.id}
                            className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-100"
                            style={{ zIndex: 3 - idx }}
                          >
                            {car.photos[0] ? (
                              <img
                                src={car.photos[0]}
                                alt=""
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 价位和设计来源标签 */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {shop.costRanges.slice(0, 2).map((r) => (
                        <span
                          key={r}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100"
                        >
                          {r}
                        </span>
                      ))}
                      {shop.designSources.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
