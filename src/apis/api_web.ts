// import type {anyObject} from '@/types/common';
// import type {siteData} from '@/types/apiWeb'
// const api_web = {
//   urlSearchToObj() {
//     const pairs = window.location.search.substring(1).split('&');
//     let obj:{ [key: string]: string }= {};
//     let pair, i;
//     for (i in pairs) {
//       if (pairs[i] === '') continue;

//       pair = pairs[i].split('=');
//       obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
//         .replace(/</g, '&lt;')
//         .replace(/>/g, '&gt;');
//     }
//     return obj;
//   },
//   processSupplier(): anyObject{
//     if (/friday\.tw/.test(location.hostname)) {
//       return this.supplierForFriday();
//     } else {
//       return this.supplierForBsite();
//     }
//   },
//   // 取得friday供應商資料
//   async supplierForFriday() {
//     return await this.getSiteData('fridayshoppingmall');
//   },
//   // 取得B站供應商資料
//   async supplierForBsite() {
//     let cacheData = null;
//     const siteCode = this.getSiteCode();
//     let navigationCache = this.getCache('supplier_cache');
//     if (
//       !/^(friday|ec2|category|aisearch|search|product|brandPromotion|branchPromotion|allBrands|aiPromotion|website|member|onsale|order_otp|login|intro|favorite|discount|crazy|arrive|myhome|happygo|superBrand|fetmcAppBonus|googleAi)$/i.test(
//         siteCode
//       )
//     ) {
//       if (siteCode) {
//         let supplierData = null;
//         supplierData = await this.getSiteData(siteCode);

//         if (supplierData) {
//           const { isUnderCounstruction } = supplierData;
//           if (isUnderCounstruction === 'Y') {
//             const p = sessionStorage.getItem('preview');
//             const { preview } = this.urlSearchToObj();
//             if (preview || p) {
//               sessionStorage.setItem('preview', '1');
//             } else {
//               window.location.href = '/consturction';
//             }
//           }

//           this.setCache('supplier_cache', cacheData, 86400);
//         } else {
//           window.location.href = '/entrance/brand'; // 都沒資料轉去品牌牆
//         }
//       } else if (navigationCache) {
//         cacheData = navigationCache;
//       }
//     } else {
//       if (navigationCache) {
//         cacheData = navigationCache;
//       }
//     }

//     if (cacheData) {
//       window['siteData'] = cacheData;
//     }
//     console.log('now site data:', cacheData);

//     return cacheData;
//   },
//   //取得AI4資料
//   async getSiteData(siteCode) {
//     let pathname = `bWeb/config?urlSuffix=${siteCode}&version=1`;

//     let resultData = await fetch(`${configApiPath}${pathname}`, fetchGetHeaders)
//       .then((res) => res.json())
//       .then((res) => {
//         if (res && res.resultCode === 0) {
//           return res.resultData[0];
//         } else {
//           window.location.href = '/';
//         }
//       })
//       .catch((err) => {
//         console.error(`get bWeb/config faliure`);
//         console.error(err);
//       });
    
//     if (!resultData) {
//       return null;
//     }
//     const { siteLayout, productScope, childSiteId } = resultData;

//     // 設定layout樣式, bSite先用0, aSite用1
//     /** siteLayout
//      * P1-一般B網  P2-員購網  P3-主題網  P4-A型
//      */
//     resultData['siteLayout'] = siteLayout;
//     resultData['isAsite'] = siteLayout === 'P4';

//     if (productScope) {
//       Object.assign(resultData, this.getProductScope(productScope));
//     }

//     // 取得某siteId下的分店資料
//     resultData['subSiteData'] = [];
//     if (childSiteId) {
//       const subAry = childSiteId.split(',');
//       for (let i = 0; i < subAry.length; i++) {
//         resultData.subSiteData[i] = await this.getSubSiteData(subAry[i]);
//       }
//     }

//     return resultData;
//   },
//   // 解析productScope 轉productScopeK, productScopeV. 對應後端ai api filter k,v
//   getProductScope(productScope) {
//     const obj = {};
//     if (productScope) {
//       const aryData = productScope.split(';');
//       const productScopeK = aryData[0].replace(/\[|\]/g, '');
//       const productScopeV = aryData.slice(1).reduce((p, v) => {
//         const d = v.replace(/\[|\]|\s/g, '');
//         const f = p.concat([d]);
//         return f;
//       }, []);
//       obj['productScopeK'] = productScopeK;
//       obj['productScopeV'] = productScopeV;
//     }
//     return obj;
//   },
//   getCache: (name: string) => {
//     if (!name || typeof name !== 'string') return null;

//     const cache = window.sessionStorage.getItem(name);
//     if (!cache) return null;

//     const obj = JSON.parse(cache);
//     const { data, expires } = obj;
//     if (data && expires > new Date().getTime()) {
//       return obj.data;
//     } else {
//       return null;
//     }
//   },
//   setCache: (name: string, value, plusSeconds: number) => {
//     if (!name || !value || !plusSeconds) return false;

//     const now = new Date();
//       now.setSeconds(now.getSeconds() + plusSeconds);
//     }
// }

// export default api_web;