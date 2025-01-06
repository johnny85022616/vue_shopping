import config from '@/config/config';
import tools from '@/util/tools';
import product_ui from './product/product_ui';
import type { anyObject } from '@/types/common';
import type { product, productsObj } from '@/types/product';
import type { comboProduct } from '@/types/comboProduct';
import type { productInfo } from '@/types/productInfo';

const { cloudApiPath, aiApiPath, fetchPostHeaders } = config;

const api_product = {
  // 取商品集合資料
  async getProducts(pids: string[], type = 1): Promise<productsObj | null> {
    const resultData = await fetch(`${cloudApiPath}product/v2/productinfo`, {
      ...fetchPostHeaders,
      body: JSON.stringify({
        param: {
          productIdList: pids,
          type,
        },
      }),
    } as anyObject)
      .then((res) => res.json())
      .then((res) => {
        const { resultCode, resultData } = res;
        return resultCode === 0 && resultData.length > 0
          ? resultData.map((v: product) => {
              const img = v.images && v.images.replace('-uat2', '');
              return Object.assign(v, { images: img, image_url: img });
            })
          : null;
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
    if (!resultData) {
      return null;
    }
    return resultData.reduce((p: productsObj, v: product) => {
      const idx = v.productId;
      return Object.assign(p, { [idx]: v });
    }, {});
  },
  /** 
   ** 取單商品資料
      NORMAL(0, "主商品"), // 一般商品、主商品
      COMBINE_PARENT(1, "組合母商品"), // 組合商品的母商品
      COMBINE(2, "組合商品"), // 組合商品的子商品
      INCREASE(3, "加購"),
      GIFT(4, "贈品"),
      PROMOTION(5, "促銷商品"), 
      PREORDER(6, "預購商品"),
      STORE_DISCOUNT(7, "限折"),
      PROMOITON_GIFT(8, "贈品活動");
   * */
  async getProduct(
    pid: number,
    campaignFlagsType = 'claim',
    checkComboQty = false /** 是否檢查為組合並檢查庫存 */
  ): Promise<productInfo | null> {
    const cacheName = 'product_info_' + pid + '_' + campaignFlagsType + '_' + checkComboQty;
    const cache = tools.getCache(cacheName);
    let pInfo = null;

    if (cache) {
      pInfo = cache;
    } else {
      pInfo = await fetch(`${cloudApiPath}product/v2/${pid}?campaign_attr=${campaignFlagsType}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.resultData) tools.setCache(cacheName, res.resultData, 300);
          return res.resultData || null;
        })
        .catch(() => {
          return null;
        });
    }

    if (!pInfo) return null;

    if (checkComboQty) {
      const isCombo = pInfo.tags.some((v: string) => v === 'COMBO');
      if (isCombo) {
        const comboInfo = await this.getComboProduct(pid);
        if (comboInfo) {
          if (comboInfo.saveComboPurchaseQty) {
            pInfo.comboPurchaseMaxQty = comboInfo.saveComboPurchaseQty;
          }
          if (comboInfo.uiComboData) {
            pInfo.uiComboData = comboInfo.uiComboData;
          }
        }
      }
    }

    // API裡 promoPrice 都設 null, 後面給 campaignFlags 去計算
    if (pInfo.price && pInfo.price.promoPrice) {
      pInfo.price.promoPrice = null;
    }

    return pInfo;
  },
  // 取得商品的組合商品
  async getComboProduct(pid: number) {
    const pInfo = await fetch(`${cloudApiPath}product/v2/${pid}/combo`)
      .then((res) => res.json())
      .then((res) => {
        const { resultCode, resultData } = res;
        if (resultCode !== 0) return null;
        const comboData: comboProduct[] = resultData.comboChildProducts;
        const { itemData, saveComboPurchaseQty } = product_ui.getUiComboData(comboData);
        const output = {
          cartComboData: this.getCartComboData(comboData), // 初始化購物車組合商品資料
          uiComboData: itemData, // 解析在UI的下拉資料
          saveComboPurchaseQty, // 控制 主商品 安全購買量
        };

        return output;
      })
      .catch(() => {
        return null;
      });

    if (!pInfo) return null;
    return pInfo;
  },
  /**
   *
   * @param {Array} items 組合API資料
   * @returns Array 初始化加入購物車需要的陣列
   */
  getCartComboData: (items: any) => {
    return items.map((p: any) => {
      const product = p.refProduct; // 商品資料

      return {
        comboId: p.comboId, // 組合ID
        pid: product.pid, // 商品ID
        specId: null, // 規格ID
        qty: p.comboQty, // 可接單量 = 1個Item至少要買多少個Pieces
        isSelected: false, // 是否已選擇
      };
    });
  },
};

export default api_product;
