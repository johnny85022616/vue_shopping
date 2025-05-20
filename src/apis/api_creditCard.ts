import type { creditCard } from '@/types/creditCard';
import config from '../config/config';
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
}


export default api_creditCard 