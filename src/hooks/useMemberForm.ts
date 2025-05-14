import { reactive, type Ref } from 'vue';
import tools from '@/util/tools';

export interface useMemeberForm {
  memberForm: {
    name: string;
    nameAlert: string;
    phone: string;
    phoneAlert: string;
    city: string ;
    region: string ;
    road: string;
    addressAlert: string;
  };
  formCheck: (fields: ('name' | 'phone' | 'address')[]) => boolean;
}

export default function useMemeberForm():useMemeberForm {
  const memberForm = reactive({
    name: '',
    nameAlert: '',
    phone: '',
    phoneAlert: '',
    city: '',
    region: '',
    road: '',
    addressAlert: '',
  });

  //防呆檢查
  function formCheck(fields: ('name' | 'phone' | 'address')[]): boolean {
    const { checkName, checkMoblie, checkAddress } = tools;
    const alertMap = {
      name: () => (memberForm.nameAlert = checkName(memberForm.name)),
      phone: () => (memberForm.phoneAlert = checkMoblie(memberForm.phone)),
      address: () => (memberForm.addressAlert = checkAddress(memberForm.city, memberForm.region, memberForm.road)),
    };
    return fields.every(field => {
      alertMap[field]();
      if (field === 'name') return !memberForm.nameAlert;
      if (field === 'phone') return !memberForm.phoneAlert;
      if (field === 'address') return !memberForm.addressAlert;
      return true;
    });
  }
  return {
    memberForm,
    formCheck,
  };
}
