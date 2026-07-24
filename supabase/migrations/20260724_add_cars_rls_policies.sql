-- =====================================================
-- cars 表 RLS 策略：UPDATE 和 DELETE
-- 执行前请确保已开启 RLS
-- 使用方式：在 Supabase SQL Editor 中粘贴执行
-- =====================================================

-- 1. 确保 cars 表已开启 Row Level Security
-- 如果未开启，取消下面这行的注释后执行
-- ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- 2. 允许用户更新自己的记录
CREATE POLICY "Users can update their own cars"
  ON cars
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. 允许用户删除自己的记录
CREATE POLICY "Users can delete their own cars"
  ON cars
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 验证：查询当前 cars 表的所有策略
-- =====================================================
-- SELECT * FROM pg_policies WHERE tablename = 'cars';