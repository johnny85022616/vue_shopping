import config from '@/config/config';
import tools from '@/util/tools';
import product_ui from './product/product_ui';
import api_campaign from './api_campaign';
import { getCampaignUI } from './campaign/campaign_util';
import type { anyObject } from '@/types/common';
import type { product, productsObj } from '@/types/product';
import type { comboProduct } from '@/types/comboProduct';
import type { productInfo } from '@/types/productInfo';
import bestDiscountApi from '@/apis/bestDiscount_util';

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
  //取單品供應商活動最佳解
  async querySupplierBestDiscount(pid: number): Promise<number> {
    if (!pid) return 0;
    const supplierData = window.fridayData || window.siteData;
    if (supplierData && supplierData.campaignId?.v && supplierData.campaignId.v?.length > 0) {
      const payload = {
        campaignId: supplierData.campaignId.v[0],
        productIdList: [`${pid},1`],
        siteId: supplierData.siteId || '',
      };
      //取bestDiscountInput
      const d = await bestDiscountApi.getProductDiscountInput(payload);
      //取最佳解
      const bestDiscount = await bestDiscountApi.getBestDiscount(d);
      return bestDiscount?.totalDiscount || 0;
    }
    return 0;
  },
  /**
   *  取商品優惠活動 (單品頁顯示用)
   * ○ 商品頁標籤，顯示 CD、AC、FV、BC、PC 五大類，標籤後方加上活動數量。
      CD：滿額滿件現折
      BC：現折券
      AC：結帳送折價券
      FV：結帳送購物金
      PC：折扣碼
   * */
  async getProductCampaign(pInfo: productInfo /** 商品資料 */, myOwnCampaignIds: string[] = []) {
    const { campaignFlags, price } = pInfo;
    const couponCategory: { [key: string]: { tagTitle: string; data: any[] } } = {
      CD: { tagTitle: '滿額滿件現折', data: [] },
      BC: { tagTitle: '現折券', data: [] },
      AC: { tagTitle: '結帳送折價券', data: [] },
      FV: { tagTitle: '結帳送購物金', data: [] },
      PC: { tagTitle: '折扣碼', data: [] },
      ED: { tagTitle: '每滿N件', data: [] },
      AED: { tagTitle: '每滿N件折上折', data: [] },
      ADD: { tagTitle: '超取現折券', data: [] },
    };
    const sameKeyObj: { [key: string]: string } = {
      LD: 'ED',
      ALD: 'AED',
    };

    if (campaignFlags) {
      if (/print=1/i.test(location.search)) console.log(campaignFlags);
      const campaignIds: string[] = [];
      campaignFlags.v.forEach((v) => {
        if (v)
          v.forEach((y) => {
            // 過濾需要算折扣的資料即可 , campaign_utils.js 要做對應處理
            if (/^(PD|CD|AC|FV|BC|PC|SC|OC|ED|ASD|AED|LD|ALD|ADD)_/i.test(y)) {
              campaignIds.push(y);
            }
          });
      });
      // 取得活動並比對自己有沒有已領取
      let campaignInfo = await this.getCampiagn(campaignIds, myOwnCampaignIds);
      if (campaignInfo) {
        if (/print=1/i.test(location.search)) console.log('campaignInfo', campaignInfo);

        // 過濾只有單品折扣的劵 PD_ 開頭
        const promoPriceCampaignInfo = campaignInfo.filter((v) => /^PD_/i.test(v.campaignId));

        // D9再折劵 抽出哪寫劵有綁定再折劵
        const childCampaignMapObj = campaignInfo
          .filter((v) => /^ASD_/i.test(v.campaignId)) // 取出ASD開頭劵
          .reduce((map, v) => {
            const parentCampaignIds = v.offerContents?.v?.productRange?.v2[0]?.split(',') || [];
            parentCampaignIds.forEach((id: string) => (map[id] = v)); // 將parentCampaignId對應至child campaign
            return map;
          }, {});

        if (/print=1/i.test(location.search)) console.log('childCampaignMapObj', childCampaignMapObj);

        // 指定折價卷分類 顯示在頁面
        campaignInfo.reduce((acc, d) => {
          if (!d?.campaignId) return acc;

          const code = d.campaignId.match(/(\w+)_/)?.[1];
          if (!code) return acc;

          const key = couponCategory[code] ? code : sameKeyObj[code];
          if (key) {
            // 再折劵對應，塞回母劵
            if (childCampaignMapObj[d.campaignId]) d.childCampaignInfo = childCampaignMapObj[d.campaignId].ui;

            couponCategory[key].data.push(d);
          }

          return acc;
        }, {});

        if (/print=1/i.test(location.search)) console.log('couponCategory', couponCategory);

        // 過濾空ARRAY、重組getTitle、另外取出再折劵 多出一個類
        const moreDiscountCouponObj: { tagTitle: string; data: any } = {
          tagTitle: '',
          data: [],
        };
        const filterCouponObj: any = {};
        let addCampaignData; //活動代號ADD資料

        for (const [key, { data: d, tagTitle: t }] of Object.entries(couponCategory)) {
          if (d.length === 0) continue;

          // 判斷再折劵
          const filteredData = d.filter((v) => {
            if (v?.childCampaignInfo) {
              moreDiscountCouponObj.data.push(v);
              // return false; // 過濾掉已經有子劵的
            }
            return true;
          });

          const obj = {
            tagTitle: `${t}(${filteredData.length})`,
            data: filteredData,
          };

          if (key === 'ADD') {
            addCampaignData = obj;
          } else if (filteredData.length > 0) {
            filterCouponObj[key] = obj;
          }
        }

        //若有再折劵
        if (moreDiscountCouponObj.data.length > 0) {
          moreDiscountCouponObj.tagTitle = `再折劵(${moreDiscountCouponObj.data.length})`;
          Object.assign(filterCouponObj, { ASD: moreDiscountCouponObj });
        }

        //若有d16資料則加入到最後面
        if (addCampaignData) filterCouponObj['ADD'] = addCampaignData;
        pInfo = Object.assign(pInfo, this.calcProductDiscount(price, promoPriceCampaignInfo), {
          couponCategory: filterCouponObj,
        });
      }
    }
    if (/print=1/i.test(location.search)) console.log('pInfo', pInfo);
    return pInfo;
  },
  async getCampiagn(campaignIds: string[] = [], myOwnCampaignIds: string[] = [] /** 自己有哪些campaignId */) {
    if (campaignIds.length === 0) {
      return null;
    }
    const resultData = await api_campaign.getCampaignDetail(campaignIds);
    console.log('resultData', resultData);
    const newResultObj: any = {};
    resultData.forEach((v: campaignInfo) => {
      let ui = {};

      // 組合UI需要
      try {
        ui = getCampaignUI(v, myOwnCampaignIds);
      } catch (e) {
        console.error(e);
      }

      newResultObj[v.campaignId] = Object.assign(v, { ui });
    });
    // 過濾掉PD單品折、純展示。 並重新排序，元 > 折 > 送購物金
    return campaignIds.map((v) => newResultObj[v]).filter((v) => !!v);
  },
  /**
   * 計算單品活動折%折錢結果
   * @param {Object} priceObj
   * @param {Array} campaignInfo
   * return priceObj include promoPrice
   */
  calcProductDiscount(priceObj: any, campaignInfo: any) {
    if (!campaignInfo || campaignInfo.length === 0)
      return {
        price: priceObj,
      };

    let productDiscount = null; // 單品扣抵金額 及 組合結帳要送出的參數
    let tempProductDiscount: any[] = []; // 收集單品折扣物件
    let promoPrice: number | null = null;

    // 收集單品折扣
    campaignInfo.forEach((info: campaignInfo) => {
      const { campaignId, offerContents } = info;
      const { discount, digitalSignal } = offerContents;

      let ratio: number | undefined, amount: number | undefined;
      if (discount) {
        const disAry = discount.find((v) => v !== '')?.split(',');
        if (disAry) {
          if (disAry[0] === 'R') {
            ratio = Number(disAry[1]);
          }
          if (disAry[0] === 'A') {
            amount = Number(disAry[1]);
          }
        }
      }

      let discreaseAmount = 0; // 可扣去多少錢
      if (ratio) {
        promoPrice = Math.floor(priceObj.memberPrice * ratio);
        discreaseAmount = priceObj.memberPrice - promoPrice;
      }
      if (amount) {
        promoPrice = Math.floor(priceObj.memberPrice - amount);
        discreaseAmount = amount;
      }

      tempProductDiscount.push({
        type: 1,
        discreaseAmount,
        digitalSignal,
        campaignId,
        promoPrice,
      });
    });

    // 重新排序單品折扣，折最多排第一位
    if (tempProductDiscount.length > 0) {
      tempProductDiscount = tempProductDiscount.sort((a, b) => a.promoPrice - b.promoPrice);
      productDiscount = tempProductDiscount[0];
      promoPrice = productDiscount.promoPrice;
    }

    return { price: Object.assign(priceObj, { promoPrice }), productDiscount };
  },
};

export default api_product;
