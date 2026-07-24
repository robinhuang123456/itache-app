'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, MapPin, Car as CarIcon } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import MapView from '@/components/MapView';
import AddCarModal from '@/components/AddCarModal';
import LoginButton from '@/components/LoginButton';
import LoginModal from '@/components/LoginModal';
import MyCarsModal from '@/components/MyCarsModal';
import { useUser } from '@/lib/auth-context';
import { getAllCars, type Car } from '@/lib/data';

export default function Home() {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMyCars, setShowMyCars] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const { user, isOpenLoginModal, closeLoginModal } = useUser();

  // 加载所有车辆数据（异步，从 Supabase 加载）
  const loadCars = useCallback(async () => {
    const cars = await getAllCars();
    setAllCars(cars);
  }, []);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  // 处理车辆添加/编辑完成
  const handleCarAdded = useCallback(() => {
    loadCars();
  }, [loadCars]);

  // 处理编辑车辆请求
  const handleEditCar = useCallback((car: Car) => {
    setEditingCar(car);
    setShowAddModal(true);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg)]">
      {/* 顶部Logo区域 */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 glass z-[150] relative">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center shadow-sm">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent leading-tight">
              Itache
            </h1>
            <p className="text-[10px] text-[var(--color-text-secondary)] -mt-0.5">
              痛车地图
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LoginButton />
          {user && (
            <button
              onClick={() => setShowMyCars(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-xs font-medium text-[var(--color-text)] hover:bg-gray-200 transition-colors"
              title="我的痛车"
            >
              <CarIcon className="w-3.5 h-3.5" />
              我的痛车
            </button>
          )}
          <button
            onClick={() => { setEditingCar(null); setShowAddModal(true); }}
            className="btn-gradient flex items-center gap-1.5 text-sm"
          >
            <Plus className="w-4 h-4" />
            添加我的痛车
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="shrink-0 glass px-4 py-3 z-[150] relative border-b border-[var(--color-border)]">
        <FilterBar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />
      </div>

      {/* 地图视图 */}
      <MapView
        allCars={allCars}
        searchQuery={searchQuery || null}
      />

      {/* 添加/编辑车辆弹窗 */}
      <AddCarModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingCar(null); }}
        onCarAdded={handleCarAdded}
        editingCar={editingCar}
      />

      {/* 我的痛车弹窗 */}
      <MyCarsModal
        isOpen={showMyCars}
        onClose={() => setShowMyCars(false)}
        onCarUpdated={handleCarAdded}
        onEditCar={handleEditCar}
      />

      {/* 登录/注册弹窗 */}
      <LoginModal isOpen={isOpenLoginModal} onClose={closeLoginModal} />
    </div>
  );
}
