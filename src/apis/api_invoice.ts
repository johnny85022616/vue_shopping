import type { invoice } from '@/types/invoice';
import config from '../config/config';

const { frontApiPath, fetchPostHeaders } = config;
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
        const {resultCode ,resultData} = res
        if (resultCode  === 0 && resultData) {
          const invoiceData = resultData.invoiceInfos;
          invoiceData?.forEach((v: invoice) => {
            v.type = parseInt(v.invType);
            if(v.type === 1){
              v.name = "伊甸基金會"
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
}