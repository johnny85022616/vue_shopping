import config from '@/config/config';
import type { anyObject } from '@/types/common';
import type { product, productsObj } from '@/types/product';

const { aiCloudApiPath, aiApiPath, fetchPostHeaders } = config;

const api_product = {
  // 取商品集合資料
  async getProducts(pids: (string[]), type = 1): Promise<productsObj|null>{
    const resultData = await fetch(`${aiCloudApiPath}product/v2/productinfo`, {
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
    if(resultData){
      return null
    }
    return resultData.reduce((p:productsObj, v:product) => {
      const idx = v.productId;
      return Object.assign(p, { [idx]: v });
    }, {});
  },
}

export default api_product