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

// 百度统计 ID（从百度统计后台获取，32位字符串）
const BAIDU_TONGJI_ID = 'fd8be85221434233db603b73ad0c0440';

// 百度统计官方代码 — 直接写入 HTML 源码，确保百度爬虫能检测到
const BAIDU_TONGJI_SCRIPT = `
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?${BAIDU_TONGJI_ID}";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
`;

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
        {/* 百度统计：必须放在 head 中，使用原始 script 标签确保百度爬虫检测到 */}
        <script
          dangerouslySetInnerHTML={{ __html: BAIDU_TONGJI_SCRIPT }}
        />
      </head>
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
