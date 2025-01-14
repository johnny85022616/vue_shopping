import config from '@/config/config';
const { aiCloudApiPath, fetchPostHeaders, aiDiscountPath } = config;

export default {
  //取得單品頁供應商活動要送入最佳解api(best_discount)的payload
  async getProductDiscountInput(payload: any) {
    return await fetch(`${aiCloudApiPath}product/v2/productDiscount`, {
      ...fetchPostHeaders,
      body: JSON.stringify({ param: payload }),
    })
      .then((res) => res.json())
      .then((res) => {
        const { resultCode, resultMsg, resultData } = res;
        // 成功或是查無資料
        if ([0, 800].includes(resultCode) && resultData) {
          return resultData;
        }
        //其他狀況（999:發生未知的錯誤  1001:pid 必填 1009:超過查詢上限(500筆)）
        // uiAlert.getFadeAlert(resultMsg); TODO
        return null;
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  },
  //取得最佳解api
  async getBestDiscount(payload: any) {
    return await fetch(`${aiDiscountPath}/best_discount`, {
      ...fetchPostHeaders,
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        const { resultCode, resultData } = res;
        if (resultCode === 0 && resultData) {
          return resultData;
        }
        return null;
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  },
};
