import type { Metadata, Viewport } from 'next';
import './globals.css';
import { UserProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Itache - 痛车地图',
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
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
