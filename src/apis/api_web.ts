import type { anyObject } from '@/types/common';
import type { siteData } from '@/types/apiWeb';
import discountAndHot from '@/mockData/discountAndHot';
import config from '../config/config';
import tools from '@/util/tools';
const { configApiPath, fetchGetHeaders, fetchPostHeaders, apiPath } = config;

const api_web = {
  //判斷是否是friday主站
  determineIsFriday() {
    const siteCode = this.getSiteCode();
    const isFriday =
      /^(category|aisearch|product|order|brandPromotion|branchPromotion|allBrands|aiPromotion|website|member|onsale|order_otp|login|ShoppingIntro|favorite|discount|crazy|arrive|myhome|happygo|superBrand|fetmcAppBonus|googleAi|memberCenter)$/i.test(
        siteCode
      ) || siteCode === '';
    return isFriday;
  },
  urlSearchToObj() {
    const pairs = window.location.search.substring(1).split('&');
    let obj: anyObject = {};
    let pair, i;
    for (i in pairs) {
      if (pairs[i] === '') continue;

      pair = pairs[i].split('=');
      obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return obj;
  },
  //從網址取得供應商代號
  getSiteCode() {
    let siteCode;
    const s = location.pathname.split('/');
    if (s && s.length > 1) siteCode = s[1];
    return siteCode || '';
  },
  async processSupplier(): Promise<siteData | null | void> {
    if (this.determineIsFriday()) {
      await this.supplierForFriday();
    } else {
      return await this.supplierForBsite();
    }
  },
  // 取得friday供應商資料
  async supplierForFriday() {
    (window as anyObject).fridayData = await this.getSiteData('fridayshoppingmall');
  },
  // 取得B站供應商資料
  async supplierForBsite(): Promise<siteData | null> {
    let siteData = null;
    const siteCode = this.getSiteCode();
    if (!siteCode) return siteData;
    let supplierData = null;
    supplierData = await this.getSiteData(siteCode);

    if (supplierData) {
      const { isUnderCounstruction } = supplierData;
      if (isUnderCounstruction === 'Y') {
        const p = sessionStorage.getItem('preview');
        const { preview } = this.urlSearchToObj();
        if (preview || p) {
          sessionStorage.setItem('preview', '1');
        } else {
          window.location.href = '/consturction';
        }
      }
      siteData = supplierData;
      (window as anyObject).siteData = siteData;
    } else {
      window.location.href = '/entrance/brand'; // 都沒資料轉去品牌牆
    }
    return siteData;
  },
  //取得AI4資料
  async getSiteData(siteCode: string): Promise<siteData | null> {
    let pathname = `bWeb/config?urlSuffix=${siteCode}&version=1`;
    const fgh: anyObject = { ...fetchGetHeaders };
    let resultData = await fetch(`${configApiPath}${pathname}`, fgh)
      .then((res) => res.json())
      .then((res) => {
        if (res && res.resultCode === 0) {
          return res.resultData[0];
        } else {
          window.location.href = '/';
        }
      })
      .catch((err) => {
        console.error(`get bWeb/config faliure`);
        console.error(err);
      });

    if (!resultData) {
      return null;
    }
    const { siteLayout, productScope, childSiteId } = resultData;

    // 設定layout樣式, bSite先用0, aSite用1
    /** siteLayout
     * P1-一般B網  P2-員購網  P3-主題網  P4-A型
     */
    resultData['siteLayout'] = siteLayout;
    resultData['isAsite'] = siteLayout === 'P4';

    if (productScope) {
      Object.assign(resultData, this.getProductScope(productScope));
    }

    // 取得某siteId下的分店資料
    resultData['subSiteData'] = [];
    if (childSiteId) {
      const subAry = childSiteId.split(',');
      for (let i = 0; i < subAry.length; i++) {
        resultData.subSiteData[i] = await this.getSubSiteData(subAry[i]);
      }
    }

    return resultData;
  },
  //bweb api
  async getBwebApiData(method: string, urlSuffix: string, payload: any) {
    const option: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (/^(POST|PUT)$/i.test(method) && payload) {
      option.body = JSON.stringify({
        payload,
      });
    }
    const data = await fetch(`${configApiPath}bWeb${urlSuffix}`, option)
      .then((res) => res.json())
      .then((res) => {
        return res && res.resultData ? res.resultData : null;
      })
      .catch((err) => {
        console.error(`get bweb ${urlSuffix} faliure.`);
        console.error(err);
      });
    return data;
  },
  // 取得供應商基本資料
  async getSupplierData(supplierId: number | string): Promise<siteData | null> {
    const cacheName = 'bweb_config_' + supplierId;
    const cache = tools.getCache(cacheName);
    if (cache) return cache;

    return await fetch(`${configApiPath}bWeb/config?supplierId=${supplierId}`, fetchGetHeaders)
      .then((res) => res.json())
      .then((res) => {
        if (res && res.resultCode === 0) {
          if (res.resultData[0]) tools.setCache(cacheName, res.resultData[0], 300);
          return res.resultData[0];
        } else {
          console.error('get bWeb/config no data');
        }
      })
      .catch((err) => {
        console.error(`get bWeb/config faliure`);
        console.error(err);
      });
  },
  //取得子site資料
  async getSubSiteData(siteId: string) {
    const resultData = await fetch(`${configApiPath}bWeb/config?siteId=${siteId}&version=1`)
      .then((res) => res.json())
      .then((res) => {
        if (res && res.resultCode === 0) {
          return res.resultData[0];
        } else {
          return null;
        }
      })
      .catch(() => {
        console.error(`getSubSiteData faliure`);
        return null;
      });

    const { productScope } = resultData;
    if (productScope) {
      Object.assign(resultData, this.getProductScope(productScope));
    }
    return resultData;
  },
  // 解析productScope 轉productScopeK, productScopeV. 對應後端ai api filter k,v
  getProductScope(productScope: anyObject) {
    const obj: anyObject = {};
    if (productScope) {
      const aryData = productScope.split(';');
      const productScopeK = aryData[0].replace(/\[|\]/g, '');
      const productScopeV = aryData.slice(1).reduce((p: any, v: any) => {
        const d = v.replace(/\[|\]|\s/g, '');
        const f = p.concat([d]);
        return f;
      }, []);
      obj['productScopeK'] = productScopeK;
      obj['productScopeV'] = productScopeV;
    }
    return obj;
  },
  async getHomePageFridayBanner() {
    // GET Banners
    return fetch(`${config.apiPath()}api/home/banner/mobileweb`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.code === 1 && data?.payload?.length > 0) {
          return data.payload[0].banners;
        }
        return null;
      });
  },
  async getSliderData(version: string) {
    return fetch(
      `https://event.shopping.friday.tw/event/homepage/mobile_homepage${
        /^(ec-m|m)/.test(location.host) ? '' : '_beta'
      }.json?ver=${version}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res && res.shortcutImg) {
          return res.shortcutImg;
        } else {
          return null;
        }
      });
  },
  async getPromotionGatherApi(promotionId: string) {
    return await fetch(`${config.frontApiPath()}ai/promotion/gather/${promotionId}`, fetchGetHeaders)
      .then((res) => res.json())
      .then((res) => {
        if (res && res.resultData) {
          return res.resultData;
        }
        return null;
      })
      .catch(() => {
        return null;
      });
  },
  getProductBatchApi(rawPids: string[]): any {
    const discountAndHotData = discountAndHot;

    const data = Object.values(discountAndHotData);
    if (data.length > 0) {
      return data.map((v: any) => {
        const { price, list_price, promo_price } = v || {};
        const cheapest = promo_price ? promo_price : price;
        const ratio = Math.floor((price / list_price) * Math.pow(10, 2)) / Math.pow(10, 2);
        const discount = ratio * ((ratio * 100) % 10 === 0 ? 10 : 100);
        return {
          pid: v.pid,
          promotion: v.promotion,
          name: v.name,
          img: v.image_url,
          image_url: v.image_url,
          price: v.price,
          list_price: v.list_price,
          discount: discount === 10 ? null : discount,
          cheapest: tools.priceFormat(cheapest),
        };
      });
    } else {
      return [];
    }
  },
};

export default api_web;
