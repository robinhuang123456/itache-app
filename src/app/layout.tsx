import type { Metadata, Viewport } from 'next';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 预连接高德地图域名，加速蜂窝网络下的首次加载 */}
        <link rel="preconnect" href="https://webapi.amap.com" />
        <link rel="preconnect" href="https://restapi.amap.com" />
        <link rel="preconnect" href="https://vdata.amap.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://webapi.amap.com" />
        <link rel="dns-prefetch" href="https://restapi.amap.com" />
        <link rel="dns-prefetch" href="https://vdata.amap.com" />
      </head>
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
