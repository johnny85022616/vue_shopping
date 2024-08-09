import type { anyObject } from '@/types/common';
import config from '@/config/config';
import tools from '@/util/tools';
import api from '@/apis/api';
import type { productsObj } from '@/types/product';
import type { aiProduct } from '@/types/aiProducts';
import type { mixProduct } from '@/types/mixProducts';

const { aiCloudApiPath, aiApiPath, fetchPostHeaders } = config;

// 加入不願意曝光在其他地方的供應商Id
const excludeUnshown = (payload: anyObject) => {
  const windowData = window as anyObject;
  const siteData = windowData.siteData || windowData.fridayData;
  if (siteData && siteData.unShowSupplierIds) {
    const { filter } = payload;
    if (filter) {
      const { unShowSupplierIds } = siteData;
      filter.v[1] = unShowSupplierIds.join(',');
      const filterK = filter.k.split('');
      filterK[1] = '1';
      filter.k = filterK.join('');
    }
    return payload;
  }
};

const api_ai = {
  async getAiData(
    aiType: string,
    payload: {
      [key: string]: any;
    },
    notGetProductsInfoFlag = false
  ):Promise<mixProduct[]|aiProduct[]|null>{
    payload = excludeUnshown(payload) || payload;

    // 部份上雲的AI API判斷
    const apiUrl = /get(a|k|v|w)list/i.test(aiType) ? aiCloudApiPath : aiApiPath;
    const data = await fetch(`${apiUrl}api/${aiType}`, {
      ...fetchPostHeaders,
      body: JSON.stringify(
        Object.assign({
          target_value: this.aiUserId(),
          ...payload,
        })
      ),
    } as anyObject)
      .then((res) => res.json())
      .then(async (res) => {
        const isAorWlist = ['getalist', 'getwlist'].includes(aiType);
        if (!isAorWlist || (isAorWlist && notGetProductsInfoFlag)) {
          return res && res[0] ? res[0] : null;
        } else {
          const data = res && res[0] && res[0].pids && res[0].pids.length > 0 ? res[0].pids : null;
          if (!data) return null
          
          const priceData = await api.product.getProducts(data.map((v:aiProduct) => v.pid));
          if(!priceData) return null
          const originData = data.map((e:aiProduct) => {
            if (priceData[e.pid]) {
              return {
                ...e,
                ...priceData[e.pid],
              };
            } else {
              return e;
            }
          });
          return originData.filter((e:mixProduct) => e.price && e.price > 0);
        }
      })
      .catch((err) => {
        console.error(`get aiapi ${aiType} faliure.`);
        console.error(err);
      });
    return data;
  },
  // 站台ID
  aiUserId(): string {
    // AI API target_value
    // 設定 ai api target_value
    let aiUserId = '0';
    const gaCookie = tools.getCookies('_ga');
    if (gaCookie) {
      const matchArr = gaCookie.match(/(\d+)\.(\d+)$/gi);
      if (matchArr && matchArr.length > 0) {
        aiUserId = matchArr[0];
      }
    }
    return aiUserId;
  },
};

export default api_ai;
