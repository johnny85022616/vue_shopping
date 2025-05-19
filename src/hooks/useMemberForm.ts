import { reactive, type Ref } from 'vue';
import tools from '@/util/tools';
import address from '@/mockData/AddressMap';

interface City {
  id: number;
  name: string;
  counties?: Region[];
}
interface Region {
  id: number;
  name: string;
  zip: string;
}
interface MemberForm {
  name: string;
  nameAlert: string;
  phone: string;
  phoneAlert: string;
  city: string;
  region: string;
  road: string;
  addressAlert: string;
  cityArr: City[] | null;
  regionArr: Region[] | null;
}

export interface UseMemberForm {
  memberForm: MemberForm;
  getCounty: (id: number) => Region[];
  formCheck: (fields: ('name' | 'phone' | 'address')[]) => boolean;
}

export default function useMemberForm(): UseMemberForm {
  const memberForm: MemberForm = reactive({
    name: '',
    nameAlert: '',
    phone: '',
    phoneAlert: '',
    city: '',
    region: '',
    road: '',
    addressAlert: '',
    cityArr: [],
    regionArr: [],
  });

  //防呆檢查
  function formCheck(fields: ('name' | 'phone' | 'address')[]): boolean {
    const { checkName, checkMoblie, checkAddress } = tools;
    const alertMap = {
      name: () => (memberForm.nameAlert = checkName(memberForm.name)),
      phone: () => (memberForm.phoneAlert = checkMoblie(memberForm.phone)),
      address: () => (memberForm.addressAlert = checkAddress(memberForm.city, memberForm.region, memberForm.road)),
    };
    return fields.every((field) => {
      alertMap[field]();
      if (field === 'name') return !memberForm.nameAlert;
      if (field === 'phone') return !memberForm.phoneAlert;
      if (field === 'address') return !memberForm.addressAlert;
      return true;
    });
  }

  // 縣 資料
  function getCity(): City[] {
    return address.addressData.map((v) => {
      const { id, name } = v;
      return { id, name };
    }) || [];
  }
  // 區 資料
  function getCounty(id: number) {
    const obj = address.addressData.find((v) => v.id === id);
    return obj ? obj.counties || [] : [];
  }

  memberForm.cityArr = getCity();

  return {
    memberForm,
    formCheck,
    getCounty,
  };
}
