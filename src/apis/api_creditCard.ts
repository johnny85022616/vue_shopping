import type { addCreditCardPayload, creditCard } from '@/types/creditCard';
import config from '../config/config';
import uiAlert from './ui_alert';
const { frontApiPath, fetchGetHeaders,fetchPostHeaders } = config
const frontPath = frontApiPath()
const api_creditCard = {
  //查詢信用卡列表
  async getCreditCard(): Promise<creditCard[]> {
    return await fetch(`${frontPath}mgmt/member/creditcard`, {
      ...fetchPostHeaders,
    })
      .then((res) => res.json())
      .then((res) => {
        const { resultData } = res;
        return resultData?.creditCardInfos || [];
      })
      .catch(() => {
        console.error('queryCreditCard api Error!');
        return [];
      });
  },
  // 刪除信用卡
  async deleteCreditCard(cartId:string ): Promise<boolean> {
    return await fetch(`${frontPath}mgmt/member/creditCardDel/${cartId}`, {
      ...fetchPostHeaders,
    })
      .then((res) => res.json())
      .then((res) => {
        return res?.resultCode === 0 || false;
      })
      .catch(() => {
        return false;
      });
  },
  //新增信用卡
  async addCreditCard(postData: addCreditCardPayload): Promise<boolean> {
    return await fetch(`${frontPath}mgmt/member/creditCardAdd`, {
      ...fetchPostHeaders,
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then((res) => {
        const {resultCode , resultMsg , resultData} = res
        if(resultCode === 0 && resultData?.CREDITCARDS?.[0]){
          return true
        }
        uiAlert.getFadeAlert(resultMsg)
        return false
      })
      .catch(() => {
        uiAlert.getFadeAlert("新增信用卡錯誤")
        return false;
      });
  },
}


export default api_creditCard 