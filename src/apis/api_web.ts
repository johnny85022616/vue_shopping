import type { anyObject } from '@/types/common';
import type { siteData } from '@/types/apiWeb';
import config from '../config/config';
const { configApiPath, fetchGetHeaders , apiPath} = config;

const api_web = {
  //判斷是否是friday主站
  determineIsFriday() {
    const siteCode = this.getSiteCode();
    const isFriday =
      /^(category|aisearch|product|brandPromotion|branchPromotion|allBrands|aiPromotion|website|member|onsale|order_otp|login|intro|favorite|discount|crazy|arrive|myhome|happygo|superBrand|fetmcAppBonus|googleAi|memberCenter)$/i.test(
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
  processSupplier(): Promise<siteData | null>|void {
    if (this.determineIsFriday()) {
      this.supplierForFriday();
    } else {
      return this.supplierForBsite();
    }
  },
  // 取得friday供應商資料
  async supplierForFriday(){
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
      (window as anyObject).siteData = siteData
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
  async getHomePageFridayBanner(){
    // GET Banners
    return fetch(`${config.apiPath()}api/home/banner/mobileweb`)
      .then(r => r.json())
      .then(data => {
        if (data?.code === 1 && data?.payload?.length > 0) {
            return data.payload[0].banners;
        }
        return null
      })
  },
  async getSliderData(version: string) {
    return fetch(
      `https://event.shopping.friday.tw/event/homepage/mobile_homepage${
        /^(ec-m|m)/.test(location.host) ? "" : "_beta"
      }.json?ver=${version}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res && res.shortcutImg) {
          return res.shortcutImg;
        }else{
          return null
        }
      });
  },
};

export default api_web;
