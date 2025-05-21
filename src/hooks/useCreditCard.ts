import type { addCreditCardPayload, creditCard } from '@/types/creditCard';
import type { OrNull } from '@/types/util';
import api from '@/apis/api';
import { ref, type Ref } from 'vue';
import usePopup from './usePopup';

export interface creditCardConposable {
  creditCardData: Ref<OrNull<creditCard[]>>;
  getCreditCardData: () => void;
  deleteCreditCard: (cartId: string) => void;
  addCreditCard: (payload: addCreditCardPayload) => Promise<boolean>;
}

export default function useCreditCard(): creditCardConposable {
  const popup = usePopup();
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
  //刪除信用卡
  async function deleteCreditCard(cartId: string) {
    const confirm = await popup.confirm('是否刪除此信用卡');
    if (!confirm) return;
    const isPass = await api.creditCard.deleteCreditCard(cartId);
    if (isPass) getCreditCardData();
  }
  //新增信用卡
  async function addCreditCard(payload: addCreditCardPayload): Promise<boolean> {
    const isPass = await api.creditCard.addCreditCard(payload);
    if (isPass) getCreditCardData();
    return isPass;
  }
  return { creditCardData, getCreditCardData, deleteCreditCard, addCreditCard };
}
