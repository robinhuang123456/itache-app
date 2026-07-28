-- =====================================================
-- cars 表 SELECT 策略：允许所有人查询可见的车辆
-- 问题：RLS 开启后没有 SELECT 策略，导致未登录用户查不到任何数据
-- =====================================================

-- 允许所有人查询 is_visible = true 的车辆
CREATE POLICY "Anyone can view visible cars"
  ON cars
  FOR SELECT
  USING (is_visible = true);

-- =====================================================
-- 验证：查询当前 cars 表的所有策略
-- =====================================================
-- SELECT * FROM pg_policies WHERE tablename = 'cars';
