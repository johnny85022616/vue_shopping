import type { invoice } from '@/types/invoice';
import config from '../config/config';
import uiAlert from './ui_alert';

const { frontApiPath, fetchGetHeaders, fetchPostHeaders } = config;
const frontPath = frontApiPath();

export default {
  // 取得發票資訊
  // 取得發票資訊
  async getInvoice() {
    return await fetch(`${frontPath}mgmt/member/invoice/getInvoice`, {
      ...fetchPostHeaders,
    })
      .then((res) => res.json())
      .then((res) => {
        const { resultCode, resultData } = res;
        if (resultCode === 0 && resultData) {
          const invoiceData = resultData.invoiceInfos;
          invoiceData?.forEach((v: invoice) => {
            v.type = parseInt(v.invType);
            if (v.type === 1) {
              v.name = '伊甸基金會';
            }
          });
          return invoiceData;
        } else {
          return null;
        }
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  },
  // 驗證手機條碼
  async verifyVehicle(barcode: string) {
    const encodeBarcode = encodeURIComponent(barcode);
    return await fetch(`${frontPath}mgmt/member/invoice/checkInvoice?barCode=${encodeBarcode}`, {
      ...fetchGetHeaders,
    })
      .then((res) => res.json())
      .then((res) => {
        const { resultCode, resultData } = res;
        return resultCode === 0 && resultData === 'Y';
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  },
  // 更新個人電子發票
  async updateInvoice(payload:any) {
    return await fetch(`${frontPath}mgmt/member/invoice/setInvoice`, {
      ...fetchPostHeaders,
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        const {resultCode ,resultMsg} = res
        if (resultCode === 0) {
          uiAlert.getFadeAlert("更新成功")
          return true;
        } else {
          uiAlert.getFadeAlert(resultMsg)
          return false;
        }
      })
      .catch((err) => {
        console.error(err);
        uiAlert.getFadeAlert("更新失敗")
        return false;
      });
  },
};
