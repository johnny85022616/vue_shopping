import Campaign from "@/components/product/campaign.vue";
import type { CampaignFlags, GroupSpec, productInfo, Variant2 } from "@/types/productInfo";

export default {
  formatProductInfo(pInfo:productInfo, pageSource = 'product') {
    // 預設設定
    pInfo.tags = pInfo.flags || [];
    // 商品ID
    pInfo.pid = pInfo.pageId;

    let priceRange = null

    // 商品頁需要參數
    if (pageSource === 'product') {
      // 是否顯示選擇單一規格
      pInfo.isShowSingleSpec = true;
      // 是否顯示規格同價選項
      pInfo.isShowMultiSpec = false;
      // 是否顯示規格價格選項
      pInfo.isShowMultiSpecPrice = false;
      // 是否可變更數量
      pInfo.isChangeQuantity = true;
      // 是否購物車可以更改規格
      pInfo.isChangeSpecInCart = false;
      // 是否規格不同價，同步顯示到賣場價格
      pInfo.isSyncPriceToPage = false;
      // 商品價格
      pInfo.price = pInfo.bestDiscountPrice || pInfo.memberPrice || 0;
    }

    // 解析商品及 variants 的活動旗標
    if (pInfo.campaignFlags) {
      pInfo.campaignFlags = this.parseCampaignFlags(pInfo.campaignFlags);
    }
    if (Array.isArray(pInfo.variants)) {
      pInfo.variants = pInfo.variants.map((v) => {
        return {
        ...v,
        qty: v.qtyava ? 1 : 0,
        qtyMin: v.qtyava ? 1 : 0,
        pid: v.pageId || '',
        image_url: v.images?.[0] || '',
        campaignFlags: v.campaignFlags ? this.parseCampaignFlags(v.campaignFlags) : [],
      }
      });
    }

    // 設定價格區間
    if (pInfo?.rangeMinPrice && pInfo?.rangeMaxPrice) {
      priceRange = [pInfo.rangeMinPrice, pInfo.rangeMaxPrice]
    }

    // 根據 type 做不同格式化
    const typeActions = {
      1: () => {
        // 單一規格商品
        pInfo.isShowSingleSpec = false;
        const firstVariant = pInfo.variants?.[0];
        if (firstVariant) {
          pInfo.campaignFlags = firstVariant.campaignFlags;
          pInfo.isIntangible = firstVariant.isIntangible;
        }
      },
      2: () => {
        // 多規格同價商品
        pInfo.variants = pInfo.variants.map((v) => ({
          ...v,
          price: v.bestDiscountPrice || v.memberPrice || 0,
        }));
        
        // 商品頁需要參數
        if (pageSource === 'product') {
          pInfo.cartPayloadVariants = pInfo.variants;
        }
        pInfo.groupSpec = this.assembleProductGroupSpec(pInfo.variants, pInfo.type);
        // 根據是否有群組規格決定顯示方式
        if (pInfo?.groupSpec) {
          pInfo.isShowSingleSpec = true;
          pInfo.isShowMultiSpec = false;
        } else {
          pInfo.isShowSingleSpec = false;
          pInfo.isShowMultiSpec = true;
        }

        pInfo.campaignFlags = (Array.isArray(pInfo.variants) ? pInfo.variants : []).reduce((p: string[], v: Variant2) => {
          if (!v || !Array.isArray(v.campaignFlags)) return p;
          return [...new Set(p.concat(v.campaignFlags))];
        }, []);
        
        pInfo.isChangeSpecInCart = true;
      },
      3: () => {
        // 多規格不同價商品
        let hasBestDiscountVariant = false
        pInfo.isSyncPriceToPage = true;
        pInfo.variants = pInfo.variants.map((v) => {
          if(v.bestDiscountPrice){
            hasBestDiscountVariant = true
          }
          return {
          ...v,
          price: v.bestDiscountPrice || v.memberPrice || 0,
        }
        });
        pInfo.hasBestDiscountVariant = hasBestDiscountVariant
        // 商品頁需要參數
        if (pageSource === 'product') {
          pInfo.cartPayloadVariants = pInfo.variants;
        }

        // 根據是否有群組規格決定顯示方式
        pInfo.groupSpec = this.assembleProductGroupSpec(pInfo.variants, pInfo.type);
        if (pInfo?.groupSpec) {
          pInfo.isShowSingleSpec = true;
          pInfo.isShowMultiSpec = false;
        } else {
          pInfo.isShowSingleSpec = false;
          pInfo.isShowMultiSpec = true;
          pInfo.isShowMultiSpecPrice = true;
        }
        pInfo.campaignFlags = pInfo.variants.reduce((p: string[], v: Variant2) => {
          if (!v || !Array.isArray(v.campaignFlags)) return p;
          return [...new Set(p.concat(v.campaignFlags))];
        }, []);

        //最低價格與最高價格不相等才顯示
        if(priceRange){
          pInfo.priceRange = priceRange
        }

        pInfo.isChangeSpecInCart = true;
      },
      A: () => {
        // 組合商品
        pInfo.tags = ['COMBO'];
        pInfo.comboProducts = pInfo.variants;
        // 商品頁需要參數
        if (pageSource === 'product') {
          pInfo.cartPayloadVariants = pInfo.variants;
          pInfo.isShowSingleSpec = false;
        }
      },
      B: () => {
        // 配件商品
        pInfo.tags = ['ACC'];
        pInfo.giftProducts = pInfo.variants.filter((v) => v.productLevel === 'N');
        // 商品頁需要參數
        if (pageSource === 'product') {
          pInfo.cartPayloadVariants = pInfo.variants;
          pInfo.isShowSingleSpec = false;
        }
      },
      C: () => {
        // 加購商品
        pInfo.tags = ['ACC'];
        pInfo.additionalProducts = pInfo.variants
          .filter((add) => add.productLevel === 'N')
          .map((add) => ({
            ...add,
            aid: add.pageId,
            memberPrice: add.equivalentPrice || 0,
            quota: add.qtyMax,
          }));
          // 商品頁需要參數
        if (pageSource === 'product') {
          pInfo.cartPayloadVariants = pInfo.variants.filter((add) => add.productLevel === 'Y');
          pInfo.isShowSingleSpec = false;
        }
        pInfo.variants = pInfo.variants.map((add) => ({ ...add, campaignFlags: pInfo.campaignFlags }));
        pInfo.equivalentPrice = pInfo.variants.find((v) => v.productLevel === 'Y')?.equivalentPrice;
      },
    };

    // 執行 type 對應的格式化動作
    
    if (pInfo.variants && typeActions[pInfo.type]) {
      typeActions[pInfo.type]();
    }

    return pInfo;
  },
  // 解析活動旗標
  parseCampaignFlags(campaignFlags: CampaignFlags | string[]) {
    if (Array.isArray(campaignFlags)) {
    return campaignFlags;
  }
    const flags = campaignFlags?.v || [];
    if (!Array.isArray(flags) || flags.length === 0) return flags;
    return flags.reduce((acc: any[], cur, idx) => {
      // 不要第10個陣列 DO存展示型活動
      if (!cur || idx === 9) return acc;
      return acc.concat(cur);
    }, []);
  },
  // 組商品規格資料
  assembleProductGroupSpec(variants: Variant2[], type = '1'): GroupSpec| null {
    let groupSpec: any = null;

    // 建立群組規格選項的資料物件
    const buildGroupOption = (cur: Variant2, level = 1) => {
      const output: {
        pageId: string;
        skuId: string;
        name: string | undefined;
        qtyava: boolean;
        qty: number;
        qtyMin: number;
        memberPrice: number;
        bestDiscountPrice: number | undefined;
        image_url: string;
        price?: number;
        showPriceContent?: boolean;
      } = {
        pageId: cur.pageId,
        skuId: cur.skuId,
        name: cur.group1Content ? (level === 1 ? cur.group1Content : cur.group2Content) : cur.name,
        qtyava: cur.qtyava,
        qty: cur.qtyava ? 1 : 0,
        qtyMin: 1,
        memberPrice: cur.memberPrice,
        bestDiscountPrice: cur.bestDiscountPrice,
        image_url: (level === 1 && cur.images?.[0]) || '',  
      };
      if (type === '3') {
        output.price = cur.bestDiscountPrice || cur.memberPrice;
        output.showPriceContent = !!(cur.group1Content && cur.group2Content); //有二階才需要出現起
      }
      return output;
    };

    // 需檢查有group2Content的情境下，那每一筆都要有值，否則直接回傳null
    const hasGroup2Content = variants.some((v) => v.group2Content);
    if (hasGroup2Content) {
      const allHaveGroup2Content = variants.every((v) => v.group2Content);
      if (!allHaveGroup2Content) {
        return null;
      }
    }

    // 如果variants裡面有group1Title代表有群組規格
    if (variants?.some((v) => v.group1Content)) {
      groupSpec = {
        firstSpec: { title: '', options: {} },
        secondSpec: { title: '', options: {} },
      };

      // 1. 取得標題
      groupSpec.firstSpec.title = variants.find((v) => v.group1Title)?.group1Title || '';
      groupSpec.secondSpec.title = variants.find((v) => v.group2Title)?.group2Title || '';

      // 2. 判斷是否有第二階規格 (例如：體脂秤)
      const hasSecondSpec = variants.some((v) => v.group2Content);

      variants.forEach((variant) => {
        const g1Key = variant.group1Content;
        const g2Key = variant.group2Content;

        // --- 處理規格一 (First Spec) ---
        if (g1Key) {
          groupSpec.isSpecFirstShow = true;

          // 智慧 Key 邏輯：
          // 有二階 (體脂秤) -> 按名稱合併
          // 無二階 (水氧機) -> 按 SKU 展開 (確保 3 筆深木紋與沒貨項都出現)
          const storageKey = hasSecondSpec ? g1Key : `${g1Key}_${variant.skuId}`;

          if (!groupSpec.firstSpec.options[storageKey]) {
            groupSpec.firstSpec.options[storageKey] = buildGroupOption(variant, 1);
          } else if (variant.qtyava) {
            // 合併模式下，只要任一 SKU 有貨，該規格一選項即為有貨
            groupSpec.firstSpec.options[storageKey].qtyava = true;
          }
        }

        // --- 處理規格二 (Second Spec) ---
        if (g1Key && g2Key) {
          groupSpec.isSpecSecondShow = true;
          const parentKey = g1Key; // 規格二必定掛在規格一的名稱下

          if (!groupSpec.secondSpec.options[parentKey]) {
            groupSpec.secondSpec.options[parentKey] = [];
          }

          groupSpec.secondSpec.options[parentKey].push(buildGroupOption(variant, 2));
        }
      });

      // 3. 價格處理 (Type 3 邏輯：用規格二的最低價更新規格一)
      if (type === '3' && groupSpec.isSpecSecondShow) {
        Object.keys(groupSpec.secondSpec.options).forEach((key) => {
          const options = groupSpec.secondSpec.options[key];
          if (options && options.length > 0) {
            const minPriceOption = options.reduce((minOpt: any, curOpt: any) => {
              const currentPrice = curOpt.memberPrice || 0;
              const minPrice = minOpt.memberPrice || 0;
              return currentPrice < minPrice ? curOpt : minOpt;
            }, options[0]);

            if (groupSpec.firstSpec.options[key]) {
              groupSpec.firstSpec.options[key].memberPrice = minPriceOption.memberPrice;
              groupSpec.firstSpec.options[key].bestDiscountPrice = minPriceOption.bestDiscountPrice;
              groupSpec.firstSpec.options[key].price = minPriceOption.price;
            }
          }
        });
      }

      // 4. 最終檢查：如果沒有規格二資料，將其設為 null
      if (Object.keys(groupSpec.secondSpec.options).length === 0) {
        groupSpec.secondSpec = null;
        groupSpec.isSpecSecondShow = false;
      }
    } else if (variants?.some((v) => v.name) && variants.length > 1) {
      groupSpec = {};

      // 取得群組規格1的所有選項
      groupSpec.firstSpec = {
        title: '',
        isSpecFirstShow: true,
        options: variants
          .filter((v) => v.name)
          .reduce((acc: Record<string, any>, cur): Record<string, any> => {
            if (cur && cur.name) {
              acc[cur.name] = buildGroupOption(cur, 1);
            }
            return acc;
          }, {}),
      };
    } else {
      // 單一規格只有群組1
      if (Array.isArray(variants) && variants.length === 1) {
        groupSpec = {
          firstSpec: {
            title: '',
            isSpecFirstShow: true,
            options: variants.reduce((acc: Record<string, any>, cur) => {
              acc[cur.name] = buildGroupOption(cur, 1);
              acc[cur.name].name = cur.name;
              return acc;
            }, {}),
          },
        };
      }
    }

    // 判斷firstSpec.options長度是否大於1，新增isSpecFirstShow控制顯示
    if (groupSpec) {
      if (groupSpec.firstSpec && groupSpec.firstSpec.options) {
        const firstSpecOptionsCount = Object.keys(groupSpec.firstSpec.options).length;
        groupSpec.firstSpec.isSpecFirstShow = firstSpecOptionsCount > 1;
      }

      // 判斷secondSpec.options長度是否大於1，新增isSpecSecondShow控制顯示
      if (groupSpec.secondSpec && groupSpec.secondSpec.options) {
        const secondSpecOptionsCount = Object.keys(groupSpec.secondSpec.options).length;
        groupSpec.secondSpec.isSpecSecondShow = secondSpecOptionsCount > 0;
        // 如果有secondSpec，firstSpec一定要顯示
        groupSpec.firstSpec.isSpecFirstShow = true;
      }
    }

    return groupSpec;
  },
}