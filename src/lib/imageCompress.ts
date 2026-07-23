/**
 * 图片压缩工具
 * 将用户上传的图片压缩为指定尺寸的 JPEG，避免 localStorage 超出 5MB 限制
 */

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * 压缩图片文件为 base64 JPEG
 * @param file 原始文件
 * @param options 压缩选项
 * @returns 压缩后的 base64 字符串
 */
export function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  const { maxWidth = 800, maxHeight = 800, quality = 0.7 } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('文件格式不支持，请上传图片文件'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('读取文件失败'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        // 计算缩放比例
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // 创建 canvas 进行压缩
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // canvas 不可用时回退到原图
          resolve(result);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // 输出为 JPEG
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = result;
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsDataURL(file);
  });
}

/**
 * 估算 base64 字符串的大小（字节）
 */
export function estimateBase64Size(base64: string): number {
  // base64 字符串中每 4 个字符代表 3 字节
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  const base64Length = base64.split(',')[1]?.length || 0;
  return Math.floor((base64Length * 3) / 4) - padding;
}
