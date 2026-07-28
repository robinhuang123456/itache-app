import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { UserProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Itasha - 痛车地图',
  description: '发现身边的痛车，连接二次元车友社区',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const BAIDU_TONGJI_ID = 'fd98be8522143423db60b3673ad0c0440';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 预连接高德域名 — 认证已改用轻量 direct fetch，可提前建立地图连接 */}
        <link rel="preconnect" href="https://webapi.amap.com" />
        <link rel="dns-prefetch" href="https://restapi.amap.com" />
      </head>
      <body>
        <UserProvider>{children}</UserProvider>

        {/* 百度统计：访问量 / UV / PV / 来源追踪 */}
        {BAIDU_TONGJI_ID && (
          <Script
            id="baidu-tongji"
            strategy="afterInteractive"
            src={`https://hm.baidu.com/hm.js?${BAIDU_TONGJI_ID}`}
          />
        )}
      </body>
    </html>
  );
}
