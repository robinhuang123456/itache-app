import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 确保用户总是获取最新版本的页面，避免旧代码缓存导致注册/登录失败
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
