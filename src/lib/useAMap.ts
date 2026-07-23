'use client';

import { useState, useEffect } from 'react';

// 高德地图配置
const AMAP_KEY = '7d14ec87a85379bc158b6a778bd05a72';
const AMAP_SECURITY_CODE = '21dd8b2c6ac48c6bb6972c8fcb205d7f';
const AMAP_VERSION = '2.0';

// 高德地图类型声明
declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: any;
    _amap_initializing?: boolean;
  }
}

let loadPromise: Promise<any> | null = null;

function loadAMapScript(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject('SSR');

  // 如果已加载完成
  if (window.AMap) return Promise.resolve(window.AMap);

  // 如果正在加载
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    // 设置安全密钥（必须在脚本加载前设置）
    window._AMapSecurityConfig = {
      securityJsCode: AMAP_SECURITY_CODE,
    };

    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=${AMAP_VERSION}&key=${AMAP_KEY}&plugin=AMap.Scale,AMap.ToolBar,AMap.MarkerClusterer,AMap.Geocoder`;
    script.async = true;
    script.onload = () => {
      if (window.AMap) {
        resolve(window.AMap);
      } else {
        reject('AMap failed to initialize');
      }
    };
    script.onerror = () => reject('Failed to load AMap script');
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function useAMap() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAMapScript()
      .then(() => setReady(true))
      .catch((err) => {
        console.error('AMap load error:', err);
        setError(String(err));
      });
  }, []);

  return { ready, error };
}

export { loadAMapScript, AMAP_KEY };
