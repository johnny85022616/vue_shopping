import tools from '@/util/tools';
import config from '@/config/config';
import type { order, orderProduct } from '@/types/order';
const { fetchGetHeaders, fetchPostHeaders, frontApiPath, websiteDomain } = config;
import uiAlert from './ui_alert';

//第三方支付代號名稱對應
const thirdPartyObj: { [key: string]: string } = {
  linepay: 'LINE',
  街口支付: 'JKO',
  '全盈+pay': 'PLUS',
  悠遊付: 'UUPAY',
  'happygo pay': 'HGPAY',
};

const isMobile = /mobile/i.test(navigator.userAgent);
const isAppWebview = /gohappy/i.test(navigator.userAgent);

export default {
  // 取得訂單明細
  async getOrders(page = 1, rows = 10, extPayload = null) {
    const siteId = window.siteData?.siteId || '';
    let fetchApi = `${frontApiPath()}v1/order/getcusorderlist`;
    let fetchPayload = {
      ...fetchPostHeaders,
      body: JSON.stringify({
        pageNumber: page,
        pageSize: rows,
        siteId,
      }),
    };

    return await fetch(fetchApi, fetchPayload)
      .then((res) => res.json())
      .then(async (res) => {
        const { resultCode, resultData } = res;

        if (resultCode !== 0) {
          return [];
        }
        if (!resultData) {
          return [];
        }

        // 格式化資料
        return resultData.map((v: order) => {
          let isShowRefundBankForm = false, //  是否顯示退訂表單 退款資訊
            isShowRefundBankSelected = false, //  是否需要判斷退款資訊有條件選擇商品，全選不用填（信用卡情境
            isShowReturnAddressForm = false, //  是否顯示超取訂單 回收收件人地址
            isShowProcessStatusBar = true; // 是否顯示進度條

          // 獨立組合商品資料
          const mainProducts: orderProduct[] = [];
          const comboObj: any = {};
          const giftObj: any = {};
          v.productData.forEach((x) => {
            if (x.productType === 'COMBO' && x.parentId !== 0) {
              if (!comboObj[x.parentId]) comboObj[x.parentId] = [];
              comboObj[x.parentId].push(x);
            } else if (x.productType === 'GIFT') {
              if (!giftObj[x.parentId]) giftObj[x.parentId] = [];
              giftObj[x.parentId].push(x);
            } else {
              mainProducts.push(x);
            }
          });
          let isSomeReturnFlag = false;
          // 格式化資料
          v.productData = mainProducts.map((c: orderProduct) => {
            if (c.returnFlag === 'Y') {
              isSomeReturnFlag = true;
            }
            let step1 = null,
              step2 = null,
              step3 = null,
              step4 = null,
              step5 = null,
              step6 = null;

            // 設定排序
            switch (c.productType) {
              case 'PRD':
                c.sortIdx = 1;
                break;
              case 'ACC':
                c.sortIdx = 2;
                break;
              case 'COMBO':
                c.sortIdx = 3;
                break;
            }

            const {
              orderDate,
              // cfConfidenceDate,
              tranferDate,
              shipConfirmDate,
              packageInStoreDate,
              pickupDate,
              applyReturnDate,
              dispatchPickupDate,
              confirmNoDefectsDate,
              refundedDate,
              arrivalDate,
            } = c.timestamp;

            // 組合商品資料組合回來
            if (comboObj[c.productId]) {
              c['combodata'] = comboObj[c.productId];
            }
            // 贈品組合回來
            if (giftObj[c.productId] && c.productType === 'PRD') {
              c['giftdata'] = giftObj[c.productId];
            }

            // 是否顯示配送詳情
            c['isShowShippingDetail'] =
              !['超商7_11', '超商全家'].includes(v.shippingType) && c.logisticName && c.deliveryNo;

            // 正訂單流程
            if (!/^R/i.test(v.dealId)) {
              step1 = {
                text: `收到訂單`,
                time: `${orderDate.substr(0, 5)}`,
                active: true,
              };

              // step2 = cfConfidenceDate
              //   ? {
              //       text: `付款成功`,
              //       time: `${cfConfidenceDate.substr(0, 5)}`,
              //       active: true,
              //     }
              //   : {
              //       text: `付款成功`,
              //       active: false,
              //     };

              step3 = tranferDate
                ? {
                    text: `訂單處理`,
                    time: `${tranferDate.substr(0, 5)}`,
                    active: true,
                  }
                : {
                    text: `訂單處理`,
                    active: false,
                  };

              step4 = shipConfirmDate
                ? {
                    text: `已出貨`,
                    time: `${shipConfirmDate.substr(0, 5)}`,
                    active: true,
                  }
                : {
                    text: `已出貨`,
                    active: false,
                  };

              if (['超商7_11', '超商全家'].includes(v.shippingType)) {
                step5 = packageInStoreDate
                  ? {
                      text: v.pickupStoreName,
                      time: `${packageInStoreDate.substr(0, 5)}`,
                      active: true,
                    }
                  : {
                      text: v.pickupStoreName,
                      active: false,
                    };
                step6 = pickupDate
                  ? {
                      text: '取貨完成',
                      time: `${pickupDate.substr(0, 5)}`,
                      active: true,
                    }
                  : {
                      text: '取貨完成',
                      active: false,
                    };
              } else {
                step5 = arrivalDate
                  ? {
                      text: '已配達',
                      time: `${arrivalDate.substr(0, 5)}`,
                      active: true,
                    }
                  : null;
              }

              // 控制退款銀行表單
              if (v.payment.status === '付款完成') {
                if (/^(信用卡紅利折抵|(信用卡 \d))/i.test(v.payType)) {
                  isShowRefundBankSelected = true;
                  isShowRefundBankForm = true;
                }
                if (v.payType === 'ATM') {
                  isShowRefundBankForm = true;
                }
              }
              if (v.payType === '超商取貨付款') {
                isShowRefundBankForm = true;
              }
              // 是否顯示退訂地址填寫表單
              if (shipConfirmDate) {
                isShowReturnAddressForm = true;
              }
            } else {
              // 退訂單流程
              step1 = applyReturnDate
                ? {
                    text: `退訂處理中`,
                    time: `${applyReturnDate.substr(0, 5)}`,
                    active: true,
                  }
                : {
                    text: `退訂處理中`,
                    active: false,
                  };

              if (v.shippingType === '宅配收貨') {
                // 退訂 不一定派車流程
                step2 = dispatchPickupDate
                  ? {
                      text: `派車收貨`,
                      time: `${dispatchPickupDate.substr(0, 5)}`,
                      active: true,
                    }
                  : {
                      text: `派車收貨`,
                      active: false,
                    };
                step3 = confirmNoDefectsDate
                  ? {
                      text: `商品檢驗`,
                      time: `${confirmNoDefectsDate.substr(0, 5)}`,
                      active: true,
                    }
                  : {
                      text: `商品檢驗`,
                      active: false,
                    };
              }

              step4 = refundedDate
                ? {
                    text: `已退款`,
                    time: `${refundedDate.substr(0, 5)}`,
                    active: true,
                  }
                : {
                    text: `已退款`,
                    active: false,
                  };

              // ATM被取消的情境 不用顯示進度條
              if (v.shippingType === '取消訂單' && v.payType === null) {
                isShowProcessStatusBar = false;
              }
            }

            // 是否可以退貨
            c['canReturn'] = c.canReturn && c.returnFlag === null;

            //處理貨態進度條
            c['deliverProcess'] = [step1, step2, step3, step4, step5, step6].filter((x) => x);

            return c;
          });

          // 是否可以退
          v.canReturn = v.productData.some((x) => x.canReturn);

          // 重新排序
          v.productData = v.productData.sort((a, b) => a.sortIdx - b.sortIdx);

          // 設定發票連結
          if (v.payment.status === '付款完成' && v.payType !== '全額折抵' && v.memberId) {
            v['invoiceUrl'] = `/member/invoice/printing?dealId=GH${v.dealId}`;
          }

          // 第3方支付並未付款
          if (v.payment.status === '尚未付款') {
            if (Object.keys(thirdPartyObj).includes(v.payType)) {
              const urlSuffix = window.siteData ? '/' + window.siteData.urlSuffix : '';
              const displayUrl = websiteDomain() + urlSuffix + '/checkout/results';
              v['rePayPayload'] = {
                amount: v.dealPayAmount,
                dealId: v.dealId,
                deviceType: isMobile ? 11 : 12,
                resultDisplayUrl: displayUrl,
                thirdPayType: thirdPartyObj[v.payType],
              };
            }
          }

          // ATM轉帳資訊
          if (!/^R/i.test(v.dealId) && v.payType === 'ATM' && v.payment.status === '尚未付款') {
            const deadline = new Date(v.orderDate);
            deadline.setDate(deadline.getDate() + 1);
            deadline.setHours(23, 59, 59);
            if (new Date().getTime() < deadline.getTime()) {
              v['bankInfo'] = '009 彰化商業銀行 ' + v.atmPaymentData.account;
            }
          }

          /**
           * 新增額外文字處理
           * https://ysdtfrontendapiorder.docs.apiary.io/#reference/0/api/getcusorderlist
           * */
          // 付、退款方式
          const returnPayTypeHintText = v.payType === '信用卡刷退' ? '(實際退款時間依各發卡銀行為準)' : '';
          // 正、負物流方式

          return Object.assign(v, {
            returnPayTypeHintText,
            orderDate: new Date(v.orderDate).toLocaleDateString(),
            orderTime: new Date(v.orderDate).toLocaleTimeString('en-US', { hour12: false }).substr(0, 5),
            isShowRefundBankForm,
            isShowRefundBankSelected,
            isShowReturnAddressForm,
            isShowProcessStatusBar,
            isSomeReturnFlag, //是否存在部分退訂
          });
        });
      })
      .catch((err) => {
        return [];
      });
  },
  // 取得訂單購買證明
  async getOrderProductProof(dealId: number, productId: number, sizeId: number) {
    return await fetch(
      `${frontApiPath()}mgmt/order/getFile/2?dealId=${dealId}&productId=${productId}&sizeId=${sizeId}`,
      {
        ...fetchGetHeaders,
      }
    )
      .then((res) => res.json())
      .then((res) => {
        const { resultMsg, resultData } = res;
        return resultData?.fileUrl ? `https://${resultData.fileUrl}` : resultMsg;
      });
  },
  // 取得收件人隱碼解碼資料
  async getConsigneeDecode(orderId = 0, typeId = 4 /** 4 姓名 6 地址 */) {
    return await fetch(`${frontApiPath()}decode/personal`, {
      ...fetchPostHeaders,
      body: JSON.stringify({
        param: {
          orderId,
          typeId,
        },
        requestId: new Date().toLocaleString(),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const { resultCode, resultData } = res;
        return resultCode === 0 ? resultData : '';
      })
      .catch((err) => {
        return '';
      });
  },

  // 取得訂單折抵明細
  async getOrderDiscounts(dealId: number, extPayload?: any) {
    let fetchApi = `${frontApiPath()}v1/order/getorderamountdetail`;
    let fetchPayload: { body?: string; method: string; headers: any } = {
      ...fetchPostHeaders,
      body: JSON.stringify({
        dealId,
      }),
    };

    if (extPayload?.apiPath) {
      fetchApi = extPayload.apiPath;
      fetchPayload = {
        ...fetchGetHeaders,
      };
    }

    return await fetch(fetchApi, fetchPayload)
      .then((res) => res.json())
      .then((res) => {
        const { resultCode, resultData } = res;
        return resultCode === 0 ? resultData : [];
      });
  },
  // 取得退訂訂單折抵明細
  async getRefundOrderDiscounts(dealId: number) {
    return await fetch(`${frontApiPath()}v1/order/getrefundamountdetail`, {
      ...fetchPostHeaders,
      body: JSON.stringify({
        dealId,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const { resultCode, resultData } = res;
        if (resultCode !== 0) uiAlert.getFadeAlert('getRefundOrderDiscounts resultCode');
        return resultCode === 0 ? resultData : [];
      })
      .catch((err) => {
        return [];
      });
  },

  // 取得第3方支付連結
  async getThirdPartyRePayUrl(payload: any) {
    return await fetch(`${frontApiPath()}payment/thirdPay/entry`, {
      ...fetchPostHeaders,
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        const { resultCode, resultData } = res;
        if (resultCode === 0) {
          let payName = '';
          for (let i in thirdPartyObj) {
            if (payload.thirdPayType === thirdPartyObj[i]) payName = i;
          }

          window.sessionStorage.setItem(
            'checkoutThirdPayInfo',
            JSON.stringify({
              payName,
              redirectUrl: payload.resultDisplayUrl,
            })
          );
          return resultData;
        }
        return null;
      });
  },
};
