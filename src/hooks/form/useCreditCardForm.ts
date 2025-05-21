import { reactive } from "vue";
import tools from '@/util/tools';


export interface CreditCardForm {
  creditNum: string;
  creditNumAlert: string;
  expire: {
    month: string;
    year: string;
  };
  expireAlert: string;
}

export interface UseCreditCardForm {
  creditCardForm: CreditCardForm;
  checkCreditCard: () => boolean;
}

export default function useCreditCardForm(): UseCreditCardForm {
  const creditCardForm = reactive<CreditCardForm>({
    creditNum: '',
    creditNumAlert: '',
    expire: {
      month: '',
      year: '',
    },
    expireAlert: ''
  });

  //檢查信用卡號
  function checkCreditCard():boolean {
    const { checkCreditCardInfo, checkCreditExpire  } = tools;
    creditCardForm.creditNumAlert = checkCreditCardInfo(creditCardForm.creditNum);
    creditCardForm.expireAlert = checkCreditExpire(creditCardForm.expire.month, creditCardForm.expire.year);
    return !creditCardForm.creditNumAlert && !creditCardForm.expireAlert;
  }

  return {
    creditCardForm,
    checkCreditCard
  };
}