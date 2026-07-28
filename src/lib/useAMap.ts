'use client';

import { useState, useEffect } from 'react';

// 高德地图配置
const AMAP_KEY = '7d14ec87a85379bc158b6a778bd05a72';
const AMAP_SECURITY_CODE = '21dd8b2c6ac48c6bb6972c8fcb205d7f';
const AMAP_VERSION = '2.0';

// 超时和重试配置
const LOAD_TIMEOUT = 10000; // 10秒超时
const MAX_RETRIES = 2; // 最多重试2次
const RETRY_DELAY = 2000; // 重试间隔2秒

// 延迟加载：认证已改用轻量 direct fetch（无 SDK 开销），
// 只需短暂延迟让 session 检查请求先发出即可
const LOAD_DELAY = 300; // 延迟300ms后开始加载地图脚本

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
    window._AMapSecurityConfig = {
      serviceHost: `${window.location.origin}/api/_AMapService`,
    };

    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=${AMAP_VERSION}&key=${AMAP_KEY}&plugin=AMap.Scale,AMap.ToolBar,AMap.MarkerClusterer,AMap.Geocoder`;
    script.async = true;

    // 超时定时器
    const timer = setTimeout(() => {
      script.onload = null;
      script.onerror = null;
      script.remove();
      reject('AMap load timeout');
    }, LOAD_TIMEOUT);

    script.onload = () => {
      clearTimeout(timer);
      if (window.AMap) {
        retryCount = 0;
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
    loadPromise = null;
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
  const [delaying, setDelaying] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let delayTimer: ReturnType<typeof setTimeout> | null = null;

    // 延迟加载地图脚本，让认证和数据请求优先使用网络带宽
    delayTimer = setTimeout(() => {
      if (cancelled) return;
      setDelaying(false);
      loadAMapScript()
        .then(() => {
          if (!cancelled) setReady(true);
        })
        .catch((err) => {
          if (!cancelled) {
            console.error('AMap load error:', err);
            setError(String(err));
          }
        });
    }, LOAD_DELAY);

    return () => {
      cancelled = true;
      if (delayTimer) clearTimeout(delayTimer);
    };
  }, []);

  return { ready, error, delaying };
}

export { loadAMapScript, AMAP_KEY };
