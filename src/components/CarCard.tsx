'use client';

import { useState } from 'react';
import type { Car } from '@/lib/data';
import { X, Copy, Check } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onClose: () => void;
}

export default function CarCard({ car, onClose }: CarCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleCopy = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 z-[100] animate-slide-up">
      <div className="glass rounded-t-2xl px-5 pt-4 pb-6 max-w-lg mx-auto shadow-[0_-4px_24px_rgba(124,58,237,0.15)]">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4 text-[var(--color-text-secondary)]" />
        </button>

        {/* 左图右信息 */}
        <div className="flex gap-3.5">
          {/* 左侧：车辆照片 */}
          <div className="shrink-0 w-[100px] h-[100px] rounded-xl overflow-hidden">
            {!imgError ? (
              <img
                src={car.photos[0]}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="img-fallback w-full h-full text-sm">
                {car.brand} {car.model}
              </div>
            )}
          </div>

          {/* 右侧：所有信息统一左对齐 */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* 车型 + 涂装IP — 核心信息置顶，同一行 */}
            <div className="flex items-center gap-1.5 flex-wrap leading-tight">
              <span className="text-base font-extrabold text-[var(--color-text)] tracking-wide">
                {car.brand} {car.model}
              </span>
              {car.ipTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shrink-0"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 用户头像 + 昵称 + 性别 + 城市 + 职业 */}
            <div className="flex items-center gap-2">
              <div className="shrink-0 w-7 h-7 rounded-full overflow-hidden">
                {car.avatar && !avatarError ? (
                  <img
                    src={car.avatar}
                    alt={car.nickname}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-xs font-medium">
                    {(car.nickname || '车')[0]}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-[var(--color-text)] truncate">
                {car.nickname}
              </span>
              {car.gender && (
                <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-500">
                  {car.gender === 'male' ? '♂' : '♀'}
                </span>
              )}
              <span className="text-xs text-[var(--color-text-secondary)]">{car.cityName}</span>
              {car.occupation && (
                <>
                  <span className="text-[var(--color-border)] text-xs">·</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">{car.occupation}</span>
                </>
              )}
            </div>

            {/* 爱好标签 */}
            {car.hobbies && car.hobbies.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {car.hobbies.map((hobby) => (
                  <span
                    key={hobby}
                    className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-[var(--color-text-secondary)]"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            )}

            {/* 个人简介 */}
            {car.bio && (
              <p className="text-[13px] text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                {car.bio}
              </p>
            )}

            {/* 微信 / QQ 联系方式 */}
            <div className="flex items-center gap-3 text-[13px]">
              {car.contactType === 'wechat' ? (
                <>
                  <span className="text-[var(--color-text-secondary)]">微信</span>
                  <span className="font-medium text-[var(--color-text)]">{car.contactValue}</span>
                </>
              ) : (
                <>
                  <span className="text-[var(--color-text-secondary)]">QQ</span>
                  <span className="font-medium text-[var(--color-text)]">{car.contactValue}</span>
                </>
              )}
              <button
                onClick={() => handleCopy(car.contactValue, 'primary')}
                className="inline-flex items-center gap-0.5 text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors shrink-0"
              >
                {copiedField === 'primary' ? (
                  <><Check className="w-3.5 h-3.5" />已复制</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" />复制</>
                )}
              </button>
              {car.contactValue2 && (
                <>
                  <span className="text-[var(--color-border)]">|</span>
                  <span className="text-[var(--color-text-secondary)]">
                    {car.contactType2 === 'wechat' ? '微信' : 'QQ'}
                  </span>
                  <span className="font-medium text-[var(--color-text)]">{car.contactValue2}</span>
                  <button
                    onClick={() => handleCopy(car.contactValue2!, 'secondary')}
                    className="inline-flex items-center gap-0.5 text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors shrink-0"
                  >
                    {copiedField === 'secondary' ? (
                      <><Check className="w-3.5 h-3.5" />已复制</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" />复制</>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
