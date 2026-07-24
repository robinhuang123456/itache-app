'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Pencil, Trash2, Loader2, Car as CarIcon } from 'lucide-react';
import { useUser } from '@/lib/auth-context';
import { getUserCars, deleteCarFromSupabase, type Car } from '@/lib/data';

interface MyCarsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCarUpdated: () => void;
  onEditCar: (car: Car) => void;
}

export default function MyCarsModal({ isOpen, onClose, onCarUpdated, onEditCar }: MyCarsModalProps) {
  const { user, openLoginModal } = useUser();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const loadCars = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const data = await getUserCars(user.id);
    setCars(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (isOpen && user) {
      loadCars();
    }
    if (!isOpen) {
      setCars([]);
      setImgErrors({});
    }
  }, [isOpen, user, loadCars]);

  if (!isOpen) return null;

  // 未登录时提示并打开登录弹窗
  if (!user) {
    return (
      <div className="fixed inset-0 z-[200] animate-fade-in">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="absolute inset-x-0 bottom-0 glass rounded-t-2xl animate-modal-in z-[200]">
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              请先登录后查看我的痛车
            </p>
            <button
              onClick={() => {
                onClose();
                openLoginModal();
              }}
              className="btn-gradient px-6 py-2.5 rounded-xl text-sm"
            >
              去登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = async (carId: string, carName: string) => {
    const confirmed = window.confirm(`确定要删除「${carName}」吗？删除后不可恢复。`);
    if (!confirmed) return;

    const error = await deleteCarFromSupabase(carId);
    if (error) {
      alert(error);
      return;
    }

    await loadCars();
    onCarUpdated();
  };

  const handleEdit = (car: Car) => {
    onClose();
    onEditCar(car);
  };

  const handleImgError = (carId: string) => {
    setImgErrors((prev) => ({ ...prev, [carId]: true }));
  };

  return (
    <div className="fixed inset-0 z-[200] animate-fade-in">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 底部弹窗 */}
      <div className="absolute inset-x-0 bottom-0 glass rounded-t-2xl animate-modal-in z-[200] max-h-[70vh] flex flex-col">
        {/* 标题栏 */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <CarIcon className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-lg font-extrabold text-[var(--color-text)]">我的痛车</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-[var(--color-primary)] animate-spin" />
            </div>
          ) : cars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <CarIcon className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                还没有添加痛车，去添加第一辆吧！
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-[var(--color-border)]"
                >
                  {/* 缩略图 */}
                  <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-200">
                    {car.photos.length > 0 && !imgErrors[car.id] ? (
                      <img
                        src={car.photos[0]}
                        alt={car.nickname}
                        className="w-10 h-10 object-cover"
                        onError={() => handleImgError(car.id)}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
                        <CarIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* 信息区 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-medium text-[var(--color-text)] truncate">
                        {car.brand} {car.model}
                      </span>
                      {car.ipTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[var(--color-text-secondary)] truncate">
                        {car.nickname}
                      </span>
                      <span className="text-[10px] text-[var(--color-text-secondary)]">|</span>
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        {car.cityName}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
                      {car.createdAt}
                    </p>
                  </div>

                  {/* 操作按钮 */}
                  <div className="shrink-0 flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(car)}
                      className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                      title="编辑"
                    >
                      <Pencil className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(car.id, `${car.brand} ${car.model}`)
                      }
                      className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center hover:bg-red-50 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[var(--color-text-secondary)] hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
