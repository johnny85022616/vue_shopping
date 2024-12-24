// src/types/global.d.ts
declare global {
  interface Window {
    [key: string]: any; // 擴展 Window 類型，添加 fridaySiteData 屬性
  }
}

export {}; // 確保它是模塊文件
