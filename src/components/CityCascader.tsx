'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { pcaTextArr } from 'element-china-area-data';
import type { DataItem } from 'element-china-area-data';

interface CityCascaderProps {
  value: { province: string; city: string; district: string };
  onChange: (value: { province: string; city: string; district: string }) => void;
}

export default function CityCascader({ value, onChange }: CityCascaderProps) {
  const [province, setProvince] = useState(value.province || '');
  const [city, setCity] = useState(value.city || '');
  const [district, setDistrict] = useState(value.district || '');

  // 同步外部 value 变化（如表单重置）
  useEffect(() => {
    setProvince(value.province || '');
    setCity(value.city || '');
    setDistrict(value.district || '');
  }, [value.province, value.city, value.district]);

  // 省份列表
  const provinces = useMemo<DataItem[]>(() => pcaTextArr, []);

  // 当前省份下的城市列表
  const cities = useMemo(() => {
    if (!province) return [];
    const found = provinces.find((p) => p.label === province);
    return found?.children || [];
  }, [province, provinces]);

  // 当前城市下的区县列表
  const districts = useMemo(() => {
    if (!city) return [];
    const found = cities.find((c) => c.label === city);
    return found?.children || [];
  }, [city, cities]);

  const handleProvinceChange = (val: string) => {
    setProvince(val);
    setCity('');
    setDistrict('');
    onChange({ province: val, city: '', district: '' });
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    setDistrict('');
    onChange({ province, city: val, district: '' });
  };

  const handleDistrictChange = (val: string) => {
    setDistrict(val);
    onChange({ province, city, district: val });
  };

  const selectClass =
    'w-full h-10 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-primary-light)] transition-colors appearance-none cursor-pointer';

  return (
    <div className="space-y-3">
      {/* 省份选择 */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
          省份
        </label>
        <div className="relative">
          <select
            value={province}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className={selectClass}
          >
            <option value="">选择省份</option>
            {provinces.map((p) => (
              <option key={p.label} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)] pointer-events-none" />
        </div>
      </div>

      {/* 城市选择 */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
          城市
        </label>
        <div className="relative">
          <select
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={!province}
            className={`${selectClass} disabled:bg-gray-50 disabled:text-gray-400`}
          >
            <option value="">选择城市</option>
            {cities.map((c) => (
              <option key={c.label} value={c.label}>
                {c.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)] pointer-events-none" />
        </div>
      </div>

      {/* 区县选择 */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
          区/县 {districts.length > 0 ? '' : ''}
        </label>
        <div className="relative">
          <select
            value={district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={!city}
            className={`${selectClass} disabled:bg-gray-50 disabled:text-gray-400`}
          >
            <option value="">选择区/县</option>
            {districts.map((d) => (
              <option key={d.label} value={d.label}>
                {d.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)] pointer-events-none" />
        </div>
      </div>

      {/* 当前选择预览 */}
      {(province || city || district) && (
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-primary)] bg-[var(--color-primary)]/5 rounded-lg px-3 py-2">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {[province, city, district].filter(Boolean).join(' / ')}
          </span>
        </div>
      )}
    </div>
  );
}
