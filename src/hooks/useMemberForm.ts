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
    console.log(fields);
    let { checkName, checkMoblie, checkAddress } = tools;
    memberForm.nameAlert = checkName(memberForm.name);
    memberForm.phoneAlert = checkMoblie(memberForm.phone);
    memberForm.addressAlert = checkAddress(memberForm.city, memberForm.region, memberForm.road);
    if (memberForm.nameAlert.length > 0 || memberForm.phoneAlert.length > 0 || memberForm.addressAlert.length > 0) {
      return false;
    }
    return true;
  }
  return {
    memberForm,
    formCheck
  };
}
