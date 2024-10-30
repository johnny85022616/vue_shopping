import type { anyObject } from '@/types/common';
import config from '@/config/config';
import tools from '@/util/tools';
import api from '@/apis/api';
import type { productsObj } from '@/types/product';
import type { aiProduct } from '@/types/aiProducts';
import type { mixProduct } from '@/types/mixProducts';
import type { category } from '@/types/category';

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
  ): Promise<mixProduct[] | aiProduct[] | category | null> {
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
          if (!data) return null;

          const priceData = await api.product.getProducts(data.map((v: aiProduct) => v.pid));
          if (!priceData) return null;
          const originData = data.map((e: aiProduct) => {
            if (priceData[e.pid]) {
              return {
                ...e,
                ...priceData[e.pid],
              };
            } else {
              return e;
            }
          });
          return originData.filter((e: mixProduct) => e.price && e.price > 0);
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
  async getYsdtThemeData(rows = 400, categoryId = '', siteData = null, apiEndpoint = 'getalist') {
    const { siteId, b4Info, unShowSupplierIds, productScopeK, productScopeV } =
      siteData || (window as anyObject).siteData;
    let keyword = '';
    let filterObj = null;
    let supplierIds = '';
    let prodFlag = '';

    if (b4Info) {
      if (b4Info?.supplierIds) supplierIds = b4Info.supplierIds;
      if (b4Info?.prodFlag) prodFlag = b4Info.prodFlag;
      if (b4Info?.kws) keyword = b4Info.kws;
    }

    if (productScopeK && productScopeV) {
      const exObj: { [key: string]: any } = {};
      if (categoryId) exObj['category'] = categoryId;
      filterObj = this.composeScopeWithFilter(productScopeK, productScopeV, exObj);
    } else {
      const supIds = supplierIds ? supplierIds.toString() : '';
      const prodType = prodFlag || '';
      const unshownSupIds = unShowSupplierIds ? unShowSupplierIds.toString() : '';
      filterObj = this.composeBListFilter(supIds, unshownSupIds, categoryId, keyword, '', '', prodType);
    }
    const d = await this.getAiData(
      apiEndpoint,
      {
        target_value: this.aiUserId(),
        q1_x: 0.5,
        supplier_y: 1,
        filter: filterObj,
        list_num: rows,
        site_id: siteId,
        type: 2,
      },
      false
    );

    const data = d as mixProduct[];
    if (data && data.length > 0) {
      return data.map((e) => {
        const { name, images, price, isStore } = e;
        return {
          image_url: images,
          name: name,
          price: price ? price : 0,
          pid: e.pid,
          lid: e.auto_category_id_L,
          mid: e.auto_category_id_M,
          bid: e.auto_category_id,
          lidName: e.auto_category_id_L_c,
          midName: e.auto_category_id_M_c,
          bidName: e.auto_category_id_c,
          isStore: isStore,
        };
      });
    } else {
      console.warn('there is no data');
    }
  },
  composeScopeWithFilter(scopeK: string, scopeV: string, filterData: any) {
    const k: any = scopeK.split('');
    const v: any = scopeV;

    if (filterData) {
      const { category, search, prdFlag } = filterData;
      // 設定category
      if (category) {
        k[2] = 1;
        v[2] = category;
      }
      // 設定搜尋
      if (search) {
        k[3] = 1;
        v[3] = search;
      }
      //商品旗標(“S“超取， “I“ 虛擬商品 )
      if (prdFlag) {
        k[6] = 1;
        v[6] = prdFlag;
      }
    }

    return { k: k.join(''), v: v };
  },
  composeBListFilter(...argument: any) {
    const argLen = argument.length < 4 ? 4 : argument.length;
    const tag = Array(argLen).fill(0);
    const tagStr = Array(argLen).fill('');

    tag.forEach((ele, idx) => {
      if (argument[idx]) {
        if (/^!!/.test(argument[idx])) {
          tagStr[idx] = argument[idx].replace(/^!!/, '');
          tag[idx] = 2;
        } else {
          tag[idx] = 1;
          tagStr[idx] = argument[idx];
        }
      }
    });

    const k = tag.join('');
    const v = [...tagStr];
    return { k: k, v: v };
  },
  // 取得指定網站的目錄
  async getCategorys() {
    const siteData = (window as anyObject)['siteData'];
    const postData = {
      target: 'pseudoid',
      list_fun: 'allCategory',
      list_args: 'content',
      list_remote: 'b01',
      if_bWeb: '1',
      site_id: '-',
    };
    if (siteData) {
      const siteId = siteData.siteId || '-';
      postData.site_id = siteId;

      const findCache1 = tools.getCache(`ai_category_${siteId}_cache1`);
      const findCache2 = tools.getCache(`ai_category_${siteId}_cache2`);
      const findCache = tools.getCache(`ai_category_${siteId}_cache`);
      if (findCache1 || findCache2 || findCache) return;
      const data = await this.getAiData('getvlist', postData);
      if (!data) return;
      const { catg1, catg2, groupings } = data as category;
      // 有供應商所產生的[本站的樹]
      if (catg1) {
        console.log('有供應商所產生的[本站的樹]', catg1);
        tools.setCache(`ai_category_${siteId}_cache1`, catg1, 300);
      }
      // 有供應商所產生的[聯合曝光的樹]
      if (catg2) {
        console.log('有供應商所產生的[聯合曝光的樹]', catg2);
        tools.setCache(`ai_category_${siteId}_cache2`, catg2, 300);
      }
      if (groupings) {
        console.log('有供應商 catg1 & catg2 都是null 時,提供給網站使用的default 樹 ', groupings);
        tools.setCache(`ai_category_${siteId}_cache`, groupings, 300);
      }
    } else {
      const findCache = tools.getCache(`ai_category_-_cache`);
      if (findCache) return;
      const data = await this.getAiData('getvlist', postData);
      const { groupings } = data as category;
      // 沒有供應商 catg1 & catg2 都是null 時,提供給網站使用的default 樹 (或者是site id 傳入"-")
      if (groupings) {
        console.log('沒有供應商 catg1 & catg2 都是null 時,提供給網站使用的default 樹 ', groupings);
        tools.setCache(`ai_category_-_cache`, groupings, 300);
      }
    }
  },
};

export default api_ai;
