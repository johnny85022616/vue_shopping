import type { creditCard } from '@/types/creditCard';
import type { OrNull } from '@/types/util';
import api from '@/apis/api';
import { ref, type Ref } from 'vue';

export interface creditCardConposable {
  creditCardData: Ref<OrNull<creditCard[]>>;
  getCreditCardData: () => void;
}

export default function useCreditCard(): creditCardConposable {
  const creditCardData = ref<OrNull<creditCard[]>>(null);

  //取得信用卡列表
  async function getCreditCardData() {
    const data = await api.creditCard.getCreditCard();
    if (data) {
      creditCardData.value = data.map((ele: creditCard) => {
        return { ...ele, isChose: ele.isDefault === 'Y' };
      });
    }
  }
  return { creditCardData,getCreditCardData };
}
