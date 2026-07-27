-- =====================================================
-- 2026-07-27 迁移：为 cars 表增加痛车花费、施工店铺、设计来源字段
-- 目的：打通「堵塞点三」——解决信息不透明问题
-- =====================================================

-- 1. 增加花费区间字段
ALTER TABLE cars ADD COLUMN IF NOT EXISTS cost_range TEXT;

-- 2. 增加施工店铺名称字段
ALTER TABLE cars ADD COLUMN IF NOT EXISTS shop_name TEXT;

-- 3. 增加设计来源字段
ALTER TABLE cars ADD COLUMN IF NOT EXISTS design_source TEXT;

-- =====================================================
-- 验证
-- =====================================================
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'cars' ORDER BY ordinal_position;
