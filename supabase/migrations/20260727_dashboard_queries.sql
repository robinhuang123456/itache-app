-- =====================================================
-- 痛车地图 - 数据看板查询
-- 使用方式：在 Supabase SQL Editor 中粘贴执行
-- =====================================================

-- ========== 1. 注册用户总数 ==========
SELECT count(*) AS total_users
FROM auth.users;

-- ========== 2. 近7天每日新增注册 ==========
SELECT
  date(created_at) AS reg_date,
  count(*) AS new_users
FROM auth.users
GROUP BY date(created_at)
ORDER BY reg_date DESC
LIMIT 7;

-- ========== 3. 真实用户添加的车辆总数（非演示数据）=========
SELECT count(*) AS real_user_cars
FROM cars
WHERE is_user_added = true AND is_demo = false;

-- ========== 4. 演示/虚拟数据总数 ==========
SELECT count(*) AS demo_cars
FROM cars
WHERE is_demo = true;

-- ========== 5. 近7天每日新增车辆 ==========
SELECT
  date(created_at) AS add_date,
  count(*) AS new_cars,
  count(*) FILTER (WHERE is_demo = false) AS real_cars,
  count(*) FILTER (WHERE is_demo = true) AS demo_cars
FROM cars
GROUP BY date(created_at)
ORDER BY add_date DESC
LIMIT 7;

-- ========== 6. 各城市车辆分布 Top 10 ==========
SELECT
  city_name,
  count(*) AS car_count,
  count(*) FILTER (WHERE is_demo = false) AS real_count
FROM cars
GROUP BY city_name
ORDER BY car_count DESC
LIMIT 10;

-- ========== 7. 热门 IP 标签 Top 10 ==========
SELECT
  unnest(ip_tags) AS ip_tag,
  count(*) AS count
FROM cars
GROUP BY ip_tag
ORDER BY count DESC
LIMIT 10;

-- ========== 8. 有填写制作信息的车辆数 ==========
SELECT
  count(*) FILTER (WHERE shop_name IS NOT NULL AND shop_name != '') AS has_shop,
  count(*) FILTER (WHERE cost_range IS NOT NULL AND cost_range != '') AS has_cost,
  count(*) FILTER (WHERE design_source IS NOT NULL AND design_source != '') AS has_design,
  count(*) AS total
FROM cars
WHERE is_user_added = true AND is_demo = false;
