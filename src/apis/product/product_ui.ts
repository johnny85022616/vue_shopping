import type { comboProduct } from '@/types/comboProduct';

export default {
  getUiComboData: (items: comboProduct[]) => {
    const output: any = {
      itemData: [],
      saveComboPurchaseQty: 0,
    };
    const qtyPool: any[] = [];

    //console.log('getUiComboData', JSON.stringify(items, 0, 2));
    output.itemData = items.map((p) => {
      const product = p.refProduct; // 商品資料
      return {
        pid: product.pid,
        name: product.name,
        image_url: product.images[0],
        comboQty: p.comboQty,
        variants: product.variants.filter((v1) => {
          // 過濾售完
          if (v1.isSoldOut) return false;

          // 計算 庫存 / 可接單量 = 實際可以購買量
          if (v1.qty) {
            // 不限制- 看庫存 qty
            if (v1.qtyMax === 999) {
              qtyPool.push(Math.floor(v1.qty / p.comboQty));
            } else {
              // 限制- 看qty 或 qtyMax 最小值
              qtyPool.push(Math.min(Math.floor(v1.qty / p.comboQty), v1.qtyMax));
            }
          }

          return {
            id: v1.id,
            name: v1.name,
            isSoldOut: v1.isSoldOut,
          };
        }),
      };
    });

    output.saveComboPurchaseQty = Math.min(...qtyPool);

    return output;
  },
};
