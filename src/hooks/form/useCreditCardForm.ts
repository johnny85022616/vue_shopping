import { reactive, watch } from 'vue';
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
    expireAlert: '',
  });

  //檢查信用卡號
  function checkCreditCard(): boolean {
    const { checkCreditCardInfo, checkCreditExpire } = tools;
    creditCardForm.creditNumAlert = checkCreditCardInfo(creditCardForm.creditNum);
    creditCardForm.expireAlert = checkCreditExpire(creditCardForm.expire.month, creditCardForm.expire.year);
    return !creditCardForm.creditNumAlert && !creditCardForm.expireAlert;
  }

  //將卡號轉換為4位數一組(XXXX XXXX XXXX XXXX)
  function formatCreditNum() {
    let creditNumArr: string[] = [];
    let creditNum = JSON.parse(JSON.stringify(creditCardForm.creditNum));
    creditNum = creditCardForm.creditNum.replace(/[\D]/g, '').slice(0, 16);
    creditNum.split('').forEach((ch: string, index: number) => {
      if (index !== 0 && index % 4 === 0) {
        creditNumArr.push(' ', ch);
      } else {
        creditNumArr.push(ch);
      }
    });
    creditCardForm.creditNum = creditNumArr.join('');
  }

  watch(() => creditCardForm.creditNum, formatCreditNum);

  return {
    creditCardForm,
    checkCreditCard,
  };
}
