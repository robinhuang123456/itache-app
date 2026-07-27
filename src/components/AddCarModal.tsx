'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  X,
  Plus,
  ImagePlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Camera,
} from 'lucide-react';
import {
  IP_TAGS,
  BRAND_MODELS,
  DESIGN_SOURCES,
  addCar,
  saveCarToSupabase,
  updateCarInSupabase,
  type Car,
} from '@/lib/data';
import { compressImage } from '@/lib/imageCompress';
import { geocodeAddress, buildAddress, shortenCityName } from '@/lib/geoUtils';
import CityCascader from './CityCascader';
import { useUser } from '@/lib/auth-context';

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCarAdded: () => void;
  /** 传入车辆对象时进入编辑模式，null 为新增模式 */
  editingCar: Car | null;
}

export default function AddCarModal({ isOpen, onClose, onCarAdded, editingCar }: AddCarModalProps) {
  const isEditMode = !!editingCar;
  const { user, openLoginModal } = useUser();
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedIpTags, setSelectedIpTags] = useState<string[]>([]);
  const [location, setLocation] = useState({ province: '', city: '', district: '' });
  const [wechatValue, setWechatValue] = useState('');
  const [qqValue, setQqValue] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [occupation, setOccupation] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<string>('');
  const [avatarType, setAvatarType] = useState<'custom' | 'male' | 'female' | 'none'>('none');
  const [bio, setBio] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState('');
  const [showCustomIp, setShowCustomIp] = useState(false);
  const [customIpInput, setCustomIpInput] = useState('');
  const [shopName, setShopName] = useState('');
  const [designSource, setDesignSource] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [avatarCompressing, setAvatarCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // 编辑模式：打开时预填表单
  useEffect(() => {
    if (isOpen && editingCar) {
      setSelectedBrand(editingCar.brand);
      setSelectedModel(editingCar.model);
      setSelectedIpTags(editingCar.ipTags || []);
      setLocation({
        province: editingCar.province || '',
        city: editingCar.cityName || '',
        district: editingCar.district || '',
      });
      if (editingCar.contactType === 'wechat') {
        setWechatValue(editingCar.contactValue);
        setQqValue(editingCar.contactValue2 || '');
      } else {
        setWechatValue(editingCar.contactValue2 || '');
        setQqValue(editingCar.contactValue);
      }
      setNickname(editingCar.nickname);
      setGender(editingCar.gender || '');
      setOccupation(editingCar.occupation || '');
      setPhotos(editingCar.photos || []);
      setAvatar(editingCar.avatar || '');
      setAvatarType(editingCar.avatar ? (editingCar.avatar?.startsWith('/') ? (editingCar.avatar.includes('male') ? 'male' : 'female') : 'custom') : 'none');
      setBio(editingCar.bio || '');
      setHobbies(editingCar.hobbies || []);
      setShopName(editingCar.shopName || '');
      setDesignSource(editingCar.designSource || '');
    } else if (!isOpen) {
      // 关闭时重置（仅新增模式关闭时清空，编辑模式切换不重复清空）
      if (!editingCar) {
        resetForm();
      }
    }
  }, [isOpen, editingCar]);

  const resetForm = () => {
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedIpTags([]);
    setLocation({ province: '', city: '', district: '' });
    setWechatValue('');
    setQqValue('');
    setNickname('');
    setGender('');
    setOccupation('');
    setPhotos([]);
    setAvatar('');
    setAvatarType('none');
    setBio('');
    setHobbies([]);
    setHobbyInput('');
    setShopName('');
    setDesignSource('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const brands = Object.keys(BRAND_MODELS);
  const models = selectedBrand ? BRAND_MODELS[selectedBrand] || [] : [];

  const toggleIpTag = (tag: string) => {
    setSelectedIpTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePhotoSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = 1 - photos.length;
    const toProcess = Array.from(files).slice(0, remaining);

    if (toProcess.length === 0) {
      setErrorMsg('只能上传1张车辆照片');
      return;
    }

    setErrorMsg('');
    setCompressing(true);

    try {
      const compressedPhotos = await Promise.all(
        toProcess.map((file) => compressImage(file, { maxWidth: 800, maxHeight: 800, quality: 0.7 }))
      );
      setPhotos((prev) => [...prev, ...compressedPhotos]);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '图片处理失败，请重试');
    } finally {
      setCompressing(false);
    }

    // 重置input以便重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [photos.length]);

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // 选择默认头像
  const selectDefaultAvatar = (type: 'male' | 'female') => {
    setAvatarType(type);
    setAvatar(type === 'male' ? '/avatar-male.jpg' : '/avatar-female.jpg');
  };

  // 上传自定义头像
  const handleAvatarSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarCompressing(true);
    setErrorMsg('');

    try {
      const compressed = await compressImage(file, { maxWidth: 200, maxHeight: 200, quality: 0.8 });
      setAvatar(compressed);
      setAvatarType('custom');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '头像处理失败，请重试');
    } finally {
      setAvatarCompressing(false);
    }

    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  }, []);

  const removeAvatar = () => {
    setAvatar('');
    setAvatarType('none');
  };

  const validateForm = (): string | null => {
    if (photos.length === 0) return '请上传车辆照片';
    if (!nickname.trim()) return '请填写昵称';
    if (!selectedBrand) return '请选择车辆品牌';
    if (!selectedModel) return '请选择车辆型号';
    if (selectedIpTags.length === 0) return '请至少选择一个涂装IP';
    if (!location.province || !location.city) return '请选择所在省份和城市';
    if (!wechatValue.trim() && !qqValue.trim()) return '请至少填写微信号或QQ号';
    if (!gender) return '请选择性别';
    if (!occupation.trim()) return '请填写职业';
    if (!bio.trim()) return '请填写个人简介';
    if (hobbies.length === 0) return '请至少添加一个爱好';
    return null;
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    // 未登录 → 打开登录弹窗
    if (!user) {
      setErrorMsg('请先登录后再操作');
      openLoginModal();
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode && editingCar) {
        // ====== 编辑模式：直接更新现有车辆 ======
        const updatedCar: Car = {
          ...editingCar,
          nickname: nickname.trim() || '匿名痛车人',
          brand: selectedBrand,
          model: selectedModel,
          ipTags: selectedIpTags,
          city: editingCar.city,
          cityName: shortenCityName(location.city) || location.city,
          contactType: wechatValue.trim() ? 'wechat' : 'qq',
          contactValue: wechatValue.trim() || qqValue.trim(),
          contactType2: wechatValue.trim() && qqValue.trim() ? 'qq' : undefined,
          contactValue2: wechatValue.trim() && qqValue.trim() ? qqValue.trim() : undefined,
          photos,
          province: location.province || undefined,
          district: location.district || undefined,
          avatar: avatar || undefined,
          bio: bio || undefined,
          hobbies: hobbies.length > 0 ? hobbies : undefined,
          gender: gender as 'male' | 'female',
          occupation: occupation.trim() || undefined,
          shopName: shopName.trim() || undefined,
          designSource: designSource || undefined,
        };

        const updateError = await updateCarInSupabase(updatedCar, editingCar.id);
        if (updateError) {
          setErrorMsg(updateError);
          setSubmitting(false);
          return;
        }

        setSuccessMsg('修改保存成功！');
        onCarAdded();
        setTimeout(() => {
          setSuccessMsg('');
          setSubmitting(false);
          onClose();
        }, 1500);
      } else {
        // ====== 新增模式 ======
        const fullAddress = buildAddress(location.province, location.city, location.district);
        const geoResult = await geocodeAddress(fullAddress, location.city);

        let lat = 35.0;
        let lng = 105.0;
        if (geoResult) {
          lat = geoResult.lat;
          lng = geoResult.lng;
        } else {
          setErrorMsg('无法获取坐标，请检查网络后重试');
          setSubmitting(false);
          return;
        }

        const cityId = `custom-${location.province}-${location.city}`;
        const cityName = shortenCityName(location.city) || location.city;

        const newCar = addCar({
          nickname: nickname.trim() || '匿名痛车人',
          brand: selectedBrand,
          model: selectedModel,
          ipTags: selectedIpTags,
          city: cityId,
          cityName,
          contactType: wechatValue.trim() ? 'wechat' : 'qq',
          contactValue: (wechatValue.trim() || qqValue.trim()),
          contactType2: wechatValue.trim() && qqValue.trim() ? 'qq' : undefined,
          contactValue2: wechatValue.trim() && qqValue.trim() ? qqValue.trim() : undefined,
          photos,
          lat: lat + (Math.random() - 0.5) * 0.02,
          lng: lng + (Math.random() - 0.5) * 0.02,
          province: location.province,
          district: location.district,
          avatar: avatar || undefined,
          bio: bio || undefined,
          hobbies: hobbies.length > 0 ? hobbies : undefined,
          gender: gender as 'male' | 'female',
          occupation: occupation.trim() || undefined,
          shopName: shopName.trim() || undefined,
          designSource: designSource || undefined,
        });

        const saveError = await saveCarToSupabase(newCar, user?.id);
        if (saveError) {
          setErrorMsg(saveError);
          setSubmitting(false);
          return;
        }

        setSuccessMsg('痛车添加成功！');
        resetForm();
        onCarAdded();
        setTimeout(() => {
          setSuccessMsg('');
          setSubmitting(false);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '提交失败，请重试');
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] animate-fade-in">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="absolute inset-x-0 bottom-0 top-12 bg-[var(--color-bg)] rounded-t-3xl animate-modal-in overflow-hidden flex flex-col">
        {/* 顶部 */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-base font-bold">{isEditMode ? '编辑我的痛车' : '添加我的痛车'}</h2>
          <div className="w-8" />
        </div>

        {/* 表单区域 */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* 头像选择 */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              头像
            </label>
            <div className="flex items-center gap-3">
              {/* 当前头像 */}
              <div className="relative group">
                {avatar ? (
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--color-primary-light)] shadow-sm">
                    <img src={avatar} alt="头像" className="w-full h-full object-cover" />
                    {avatarCompressing && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-full">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-xl border-2 border-transparent">
                    车
                  </div>
                )}
                {avatar && (
                  <button
                    onClick={removeAvatar}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                {/* 上传自定义头像 */}
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarCompressing}
                  className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <Camera className="w-5 h-5 text-white drop-shadow" />
                </button>
              </div>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
              />

              {/* 默认头像选择 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => selectDefaultAvatar('male')}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs transition-all ${avatarType === 'male' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 font-medium' : 'border-[var(--color-border)] hover:border-[var(--color-primary-light)] text-[var(--color-text-secondary)]'}`}
                >
                  <img src="/avatar-male.jpg" alt="男生" className="w-5 h-5 rounded-full object-cover" />
                </button>
                <button
                  onClick={() => selectDefaultAvatar('female')}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs transition-all ${avatarType === 'female' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 font-medium' : 'border-[var(--color-border)] hover:border-[var(--color-primary-light)] text-[var(--color-text-secondary)]'}`}
                >
                  <img src="/avatar-female.jpg" alt="女生" className="w-5 h-5 rounded-full object-cover" />
                </button>
              </div>
            </div>
          </div>

          {/* 昵称 */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              昵称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="取一个响亮的名字吧～"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-primary-light)] transition-colors"
            />
          </div>

          {/* 性别和职业 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                性别 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 h-10 rounded-lg border text-sm transition-all ${gender === 'male' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium' : 'border-[var(--color-border)] hover:border-[var(--color-primary-light)] text-[var(--color-text-secondary)]'}`}
                >
                  男
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 h-10 rounded-lg border text-sm transition-all ${gender === 'female' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium' : 'border-[var(--color-border)] hover:border-[var(--color-primary-light)] text-[var(--color-text-secondary)]'}`}
                >
                  女
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                职业 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="如：学生、设计师、程序员..."
                value={occupation}
                onChange={(e) => {
                  if (e.target.value.length <= 20) setOccupation(e.target.value);
                }}
                maxLength={20}
                className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-primary-light)] transition-colors"
              />
            </div>
          </div>

          {/* 个人简介 */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              个人简介 <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-[var(--color-text-secondary)] ml-1">最多100字</span>
            </label>
            <textarea
              placeholder="介绍一下自己吧～喜欢的二次元作品或人物，有什么梦想..."
              value={bio}
              onChange={(e) => {
                if (e.target.value.length <= 100) setBio(e.target.value);
              }}
              rows={2}
              maxLength={100}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-primary-light)] transition-colors resize-none"
            />
            <div className="flex justify-end mt-0.5">
              <span className="text-[10px] text-[var(--color-text-secondary)]">{bio.length}/100</span>
            </div>
          </div>

          {/* 爱好标签 */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              爱好 <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-[var(--color-text-secondary)] ml-1">最多5个，每个最多10字，回车添加，可点击X删除</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {hobbies.map((hobby, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20"
                >
                  {hobby}
                  <button
                    onClick={() => setHobbies((prev) => prev.filter((_, i) => i !== idx))}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {hobbies.length < 5 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="输入爱好后按回车添加，如：摄影、cosplay、模型制作..."
                  value={hobbyInput}
                  onChange={(e) => setHobbyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = hobbyInput.trim();
                      if (val && val.length <= 10 && !hobbies.includes(val) && hobbies.length < 5) {
                        setHobbies((prev) => [...prev, val]);
                        setHobbyInput('');
                      }
                    }
                  }}
                  maxLength={10}
                  className="flex-1 h-9 px-3 text-xs rounded-lg border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-primary-light)] transition-colors"
                />
              </div>
            )}

          </div>

          {/* 车辆照片 */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              车辆照片 <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-[var(--color-text-secondary)] ml-1">上传1张</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden group">
                  <img src={photo} alt={`照片${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {photos.length < 1 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={compressing}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-1 hover:border-[var(--color-primary-light)] transition-colors disabled:opacity-50"
                >
                  {compressing ? (
                    <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin" />
                  ) : (
                    <>
                      <ImagePlus className="w-5 h-5 text-[var(--color-text-secondary)]" />
                      <span className="text-[10px] text-[var(--color-text-secondary)]">添加</span>
                    </>
                  )}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>
            {compressing && (
              <p className="text-xs text-[var(--color-primary)] mt-1 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                正在压缩图片...
              </p>
            )}
          </div>

          {/* 品牌和型号 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                品牌 <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedModel('');
                }}
                className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-primary-light)] transition-colors appearance-none"
              >
                <option value="">选择品牌</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                型号 <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedBrand}
                className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-primary-light)] transition-colors appearance-none disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">选择型号</option>
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 涂装IP */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              涂装IP（可多选） <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {IP_TAGS.map((tag) => (
                <button
                  key={tag}
                  className={`filter-tag ${selectedIpTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleIpTag(tag)}
                >
                  {tag}
                </button>
              ))}
              {/* 已选的自定义IP标签 */}
              {selectedIpTags.filter((t) => !IP_TAGS.includes(t as typeof IP_TAGS[number])).map((tag) => (
                <button
                  key={tag}
                  className="filter-tag active"
                  onClick={() => toggleIpTag(tag)}
                >
                  {tag}
                  <X className="w-2.5 h-2.5 ml-0.5" />
                </button>
              ))}
              {/* 没有找到想要的IP？自定义添加 */}
              {showCustomIp ? (
                <div className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="输入IP名称"
                    value={customIpInput}
                    onChange={(e) => setCustomIpInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = customIpInput.trim();
                        if (val && !selectedIpTags.includes(val)) {
                          setSelectedIpTags((prev) => [...prev, val]);
                          setCustomIpInput('');
                          setShowCustomIp(false);
                        }
                      }
                    }}
                    maxLength={20}
                    className="h-8 w-28 px-2 text-xs rounded-lg border border-[var(--color-primary-light)] bg-white outline-none focus:border-[var(--color-primary)] transition-colors"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      const val = customIpInput.trim();
                      if (val && !selectedIpTags.includes(val)) {
                        setSelectedIpTags((prev) => [...prev, val]);
                        setCustomIpInput('');
                        setShowCustomIp(false);
                      }
                    }}
                    className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setShowCustomIp(false); setCustomIpInput(''); }}
                    className="w-8 h-8 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] flex items-center justify-center hover:bg-black/5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCustomIp(true)}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-dashed border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  自定义IP
                </button>
              )}
            </div>
          </div>

          {/* 所在城市（省市区三级级联） */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              所在城市 <span className="text-red-500">*</span>
            </label>
            <CityCascader value={location} onChange={setLocation} />
          </div>

          {/* 联系方式 */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              联系方式 <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-[var(--color-text-secondary)] ml-1">至少填一个</span>
            </label>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="微信号"
                value={wechatValue}
                onChange={(e) => setWechatValue(e.target.value)}
                className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-primary-light)] transition-colors"
              />
              <input
                type="text"
                placeholder="QQ号"
                value={qqValue}
                onChange={(e) => setQqValue(e.target.value)}
                className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-primary-light)] transition-colors"
              />
            </div>
          </div>

          {/* 制作信息（可选） */}
          <div className="pt-2 border-t border-[var(--color-border)]">
            <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
              制作信息
              <span className="text-xs font-normal text-[var(--color-text-secondary)] ml-1">选填，帮助其他车友参考</span>
            </label>
            <div className="space-y-3">
              {/* 施工店铺 */}
              <div>
                <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5">施工店铺</label>
                <input
                  type="text"
                  placeholder="如：XX汽车贴膜工作室（选填）"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-primary-light)] transition-colors"
                />
              </div>

              {/* 设计来源 */}
              <div>
                <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5">设计来源</label>
                <select
                  value={designSource}
                  onChange={(e) => setDesignSource(e.target.value)}
                  className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-primary-light)] transition-colors appearance-none"
                >
                  <option value="">请选择设计来源</option>
                  {DESIGN_SOURCES.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 错误/成功提示 */}
        {(errorMsg || successMsg) && (
          <div className="shrink-0 px-5 py-2">
            {errorMsg && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* 提交按钮 */}
        <div className="shrink-0 px-5 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
          <button
            onClick={handleSubmit}
            disabled={submitting || compressing}
            className="w-full h-12 btn-gradient text-base font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                提交中...
              </>
            ) : successMsg ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {isEditMode ? '修改成功' : '添加成功'}
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                {isEditMode ? '保存修改' : '添加痛车'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
