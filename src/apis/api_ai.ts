// import type { anyObject } from '@/types/common';
// import config from '../config/config';
// import tools from '../util/tools';


// // 加入不願意曝光在其他地方的供應商Id
// const excludeUnshown = (payload: anyObject) => {
//   const siteData = window.siteData || window.fridayData;
//   if (siteData && siteData.unShowSupplierIds) {
//     const { filter } = payload;
//     if (filter) {
//       const { unShowSupplierIds } = siteData;
//       filter.v[1] = unShowSupplierIds.join(',');
//       const filterK = filter.k.split('');
//       filterK[1] = '1';
//       filter.k = filterK.join('');
//     }
//     return payload;
//   }
// };

// const api_ai = {
//   async getAiData(aiType:string, payload:{
//     [key:string] : any
//   }, notGetProductsInfoFlag = false) {
//     payload = excludeUnshown(payload) || payload;

//     // 部份上雲的AI API判斷
//     const apiUrl = /get(a|k|v|w)list/i.test(aiType) ? aiCloudApiPath : aiApiPath;
//     const data = await fetch(`${apiUrl}api/${aiType}`, {
//       ...fetchPostHeaders,
//       body: JSON.stringify(
//         Object.assign({
//           target_value: aiUserId(),
//           ...payload,
//         })
//       ),
//     })
//       .then((res) => res.json())
//       .then(async (res) => {
//         const isAorWlist = ['getalist', 'getwlist'].includes(aiType);
//         if (!isAorWlist || (isAorWlist && notGetProductsInfoFlag)) {
//           return res && res[0] ? res[0] : null;
//         } else {
//           const data = res && res[0] && res[0].pids && res[0].pids.length > 0 ? res[0].pids : null;

//           if (!data) return [];

//           const priceData = await getProducts(data.map((v) => v.pid));
//           const originData = data.map((e) => {
//             if (priceData[e.pid]) {
//               return {
//                 ...e,
//                 ...priceData[e.pid],
//                 image_url: priceData[e.pid].images && priceData[e.pid].images.replace('-uat2', ''),
//               };
//             } else {
//               return e;
//             }
//           });
//           return !getCache('supplier_cache') ? originData.filter((e) => e.price > 0) : originData;
//         }
//       })
//       .catch((err) => {
//         console.error(`get aiapi ${aiType} faliure.`);
//         console.error(err);
//       });
//     return data;
//   },
// }


// export default api_ai 