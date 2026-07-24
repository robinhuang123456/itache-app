'use client';

import { useState, useEffect } from 'react';

// 高德地图配置
const AMAP_KEY = '7d14ec87a85379bc158b6a778bd05a72';
const AMAP_SECURITY_CODE = '21dd8b2c6ac48c6bb6972c8fcb205d7f';
const AMAP_VERSION = '2.0';

// 超时和重试配置
const LOAD_TIMEOUT = 15000; // 15秒超时
const MAX_RETRIES = 2; // 最多重试2次
const RETRY_DELAY = 3000; // 重试间隔3秒

// 高德地图类型声明
declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: any;
    _amap_initializing?: boolean;
  }
}

let loadPromise: Promise<any> | null = null;
let retryCount = 0;

function loadAMapScript(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject('SSR');

  // 如果已加载完成
  if (window.AMap) return Promise.resolve(window.AMap);

  // 如果正在加载
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    // 使用代理方式安全验证，避免蜂窝网络下 restapi.amap.com 被拦截
    // 代理路由 /api/_AMapService/* → https://restapi.amap.com/v3/_AMapService/*
    window._AMapSecurityConfig = {
      serviceHost: `${window.location.origin}/api/_AMapService`,
    };

    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=${AMAP_VERSION}&key=${AMAP_KEY}&plugin=AMap.Scale,AMap.ToolBar,AMap.MarkerClusterer,AMap.Geocoder`;
    script.async = true;

    // 超时定时器
    const timer = setTimeout(() => {
      // 超时后移除script，让onerror触发
      script.onload = null;
      script.onerror = null;
      script.remove();
      reject('AMap load timeout');
    }, LOAD_TIMEOUT);

    script.onload = () => {
      clearTimeout(timer);
      if (window.AMap) {
        retryCount = 0; // 加载成功，重置重试计数
        resolve(window.AMap);
      } else {
        reject('AMap failed to initialize');
      }
    };

    script.onerror = () => {
      clearTimeout(timer);
      reject('Failed to load AMap script');
    };

    document.head.appendChild(script);
  });

  // 加载失败时自动重试
  return loadPromise.catch((err) => {
    loadPromise = null; // 重置，允许下次创建新Promise
    retryCount++;
    if (retryCount <= MAX_RETRIES) {
      console.warn(`AMap load failed (${err}), retrying ${retryCount}/${MAX_RETRIES} after ${RETRY_DELAY}ms...`);
      return new Promise((resolve) => setTimeout(resolve, RETRY_DELAY)).then(() => loadAMapScript());
    } else {
      console.error(`AMap load failed after ${MAX_RETRIES} retries:`, err);
      throw err;
    }
  });
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
