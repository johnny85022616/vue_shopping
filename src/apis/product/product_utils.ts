export default {
  // formatProductInfo(pInfo = {}, pageSource = 'product') {
  //   // 預設設定
  //   pInfo.tags = pInfo.flags || [];
  //   // 商品ID
  //   pInfo.pid = pInfo.pageId;

  //   let priceRange = null

  //   // 商品頁需要參數
  //   if (pageSource === 'product') {
  //     // 是否顯示選擇單一規格
  //     pInfo.isShowSingleSpec = true;
  //     // 是否顯示規格同價選項
  //     pInfo.isShowMultiSpec = false;
  //     // 是否顯示規格價格選項
  //     pInfo.isShowMultiSpecPrice = false;
  //     // 是否可變更數量
  //     pInfo.isChangeQuantity = true;
  //     // 是否購物車可以更改規格
  //     pInfo.isChangeSpecInCart = false;
  //     // 是否規格不同價，同步顯示到賣場價格
  //     pInfo.isSyncPriceToPage = false;
  //     // 商品價格
  //     pInfo.price = pInfo.bestDiscountPrice || pInfo.memberPrice || 0;
  //   }

  //   // 解析商品及 variants 的活動旗標
  //   if (pInfo.campaignFlags) {
  //     pInfo.campaignFlags = module.exports.parseCampaignFlags(pInfo.campaignFlags);
  //   }
  //   if (Array.isArray(pInfo.variants)) {
  //     pInfo.variants = pInfo.variants.map((v) => {
  //       return {
  //       ...v,
  //       qty: v.qtyava ? 1 : 0,
  //       qtyMin: v.qtyava ? 1 : 0,
  //       pid: v.pageId || '',
  //       image_url: v.images?.[0] || '',
  //       campaignFlags: v.campaignFlags ? module.exports.parseCampaignFlags(v.campaignFlags) : [],
  //     }
  //     });
  //   }

  //   // 設定價格區間
  //   if (pInfo?.rangeMinPrice && pInfo?.rangeMaxPrice) {
  //     priceRange = [pInfo.rangeMinPrice, pInfo.rangeMaxPrice]
  //   }

  //   // 根據 type 做不同格式化
  //   const typeActions = {
  //     1: () => {
  //       // 單一規格商品
  //       pInfo.isShowSingleSpec = false;
  //       const firstVariant = pInfo.variants?.[0];
  //       if (firstVariant) {
  //         pInfo.campaignFlags = firstVariant.campaignFlags;
  //         pInfo.isIntangible = firstVariant.isIntangible;
  //       }
  //     },
  //     2: () => {
  //       // 多規格同價商品
  //       pInfo.variants = pInfo.variants.map((v) => ({
  //         ...v,
  //         price: v.bestDiscountPrice || v.memberPrice || 0,
  //       }));
        
  //       // 商品頁需要參數
  //       if (pageSource === 'product') {
  //         pInfo.cartPayloadVariants = pInfo.variants;
  //       }
  //       pInfo.groupSpec = module.exports.assembleProductGroupSpec(pInfo.variants, pInfo.type);
  //       // 根據是否有群組規格決定顯示方式
  //       if (pInfo?.groupSpec) {
  //         pInfo.isShowSingleSpec = true;
  //         pInfo.isShowMultiSpec = false;
  //       } else {
  //         pInfo.isShowSingleSpec = false;
  //         pInfo.isShowMultiSpec = true;
  //       }

  //       pInfo.campaignFlags = pInfo.variants.reduce((p, v) => {
  //         return [...new Set(p.concat(v.campaignFlags))];
  //       }, []);
        
  //       pInfo.isChangeSpecInCart = true;
  //     },
  //     3: () => {
  //       // 多規格不同價商品
  //       let hasBestDiscountVariant = false
  //       pInfo.isSyncPriceToPage = true;
  //       pInfo.variants = pInfo.variants.map((v) => {
  //         if(v.bestDiscountPrice){
  //           hasBestDiscountVariant = true
  //         }
  //         return {
  //         ...v,
  //         price: v.bestDiscountPrice || v.memberPrice || 0,
  //       }
  //       });
  //       pInfo.hasBestDiscountVariant = hasBestDiscountVariant
  //       // 商品頁需要參數
  //       if (pageSource === 'product') {
  //         pInfo.cartPayloadVariants = pInfo.variants;
  //       }

  //       // 根據是否有群組規格決定顯示方式
  //       pInfo.groupSpec = module.exports.assembleProductGroupSpec(pInfo.variants, pInfo.type);
  //       if (pInfo?.groupSpec) {
  //         pInfo.isShowSingleSpec = true;
  //         pInfo.isShowMultiSpec = false;
  //       } else {
  //         pInfo.isShowSingleSpec = false;
  //         pInfo.isShowMultiSpec = true;
  //         pInfo.isShowMultiSpecPrice = true;
  //       }
  //       pInfo.campaignFlags = pInfo.variants.reduce((p, v) => {
  //         return [...new Set(p.concat(v.campaignFlags))];
  //       }, []);

  //       //最低價格與最高價格不相等才顯示
  //       if(priceRange){
  //         pInfo.priceRange = priceRange
  //       }

  //       pInfo.isChangeSpecInCart = true;
  //     },
  //     A: () => {
  //       // 組合商品
  //       pInfo.tags = ['COMBO'];
  //       pInfo.comboProducts = pInfo.variants;
  //       // 商品頁需要參數
  //       if (pageSource === 'product') {
  //         pInfo.cartPayloadVariants = pInfo.variants;
  //         pInfo.isShowSingleSpec = false;
  //       }
  //     },
  //     B: () => {
  //       // 配件商品
  //       pInfo.tags = ['ACC'];
  //       pInfo.giftProducts = pInfo.variants.filter((v) => v.productLevel === 'N');
  //       // 商品頁需要參數
  //       if (pageSource === 'product') {
  //         pInfo.cartPayloadVariants = pInfo.variants;
  //         pInfo.isShowSingleSpec = false;
  //       }
  //     },
  //     C: () => {
  //       // 加購商品
  //       pInfo.tags = ['ACC'];
  //       pInfo.additionalProducts = pInfo.variants
  //         .filter((add) => add.productLevel === 'N')
  //         .map((add) => ({
  //           ...add,
  //           aid: add.pageId,
  //           memberPrice: add.equivalentPrice || 0,
  //           quota: add.qtyMax,
  //         }));
  //         // 商品頁需要參數
  //       if (pageSource === 'product') {
  //         pInfo.cartPayloadVariants = pInfo.variants.filter((add) => add.productLevel === 'Y');
  //         pInfo.isShowSingleSpec = false;
  //       }
  //       pInfo.variants = pInfo.variants.map((add) => ({ ...add, campaignFlags: pInfo.campaignFlags }));
  //       pInfo.equivalentPrice = pInfo.variants.find((v) => v.productLevel === 'Y')?.equivalentPrice;
  //     },
  //   };

  //   // 執行 type 對應的格式化動作
  //   if (pInfo.variants && typeActions[pInfo.type]) {
  //     typeActions[pInfo.type]();
  //   }

  //   return pInfo;
  // },
}