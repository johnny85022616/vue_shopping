// 性別列舉
export enum Gender {
  "男",
  "女"
}
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
  gender: Gender;
  name: string;
  nameAlert: string;
  phone: string;
  phoneAlert: string;
  email: string;
  emailAlert: string;
  city: number;
  region: number;
  road: string;
  addressAlert: string;
  cityArr: City[] | null;
  regionArr: Region[] | null;
}

export interface UseMemberForm {
  memberForm: MemberForm;
  getCounty: (id: number) => Region[];
  changeCity: (id: number) => void;
  phoneFormat: () => void;
  formCheck: (fields: ('name' | 'phone' | 'address' | 'email')[]) => boolean;
}

export default function useMemberForm(): UseMemberForm {
  const memberForm: MemberForm = reactive({
    //性別
    gender: Gender['男'],
    //姓名
    name: '',
    nameAlert: '',
    //電話
    phone: '',
    phoneAlert: '',
    //email
    email: '',
    emailAlert: '',
    //地址
    city: 1,
    region: 1,
    road: '',
    addressAlert: '',
    cityArr: [], // 縣市陣
    regionArr: [], // 區域陣列
  });

  init();

  //初始化
  function init() {
    memberForm.cityArr = getCity();
    memberForm.city = memberForm.cityArr[0].id;
    memberForm.regionArr = getCounty(memberForm.city);
    memberForm.region = memberForm.regionArr[0].id;
  }

  //防呆檢查
  function formCheck(fields: ('name' | 'phone' | 'address' | 'email')[]): boolean {
    const { checkName, checkMoblie, checkAddress, checkEmail } = tools;
    const alertMap = {
      name: () => (memberForm.nameAlert = checkName(memberForm.name)),
      phone: () => (memberForm.phoneAlert = checkMoblie(memberForm.phone)),
      address: () => (memberForm.addressAlert = checkAddress(memberForm.city, memberForm.region, memberForm.road)),
      email: () => (memberForm.emailAlert = checkEmail(memberForm.email)),
    };
    const isPass = fields.reduce((pass, field) => {
      const fieldPass = alertMap[field]() ? false : true;
      pass = pass && fieldPass;
      return pass;
    }, true);

    return isPass;
  }

  // 縣 資料
  function getCity(): City[] {
    return (
      address.addressData.map((v) => {
        const { id, name } = v;
        return { id, name };
      }) || []
    );
  }
  // 區 資料
  function getCounty(id: number) {
    const obj = address.addressData.find((v) => v.id === id);
    return obj ? obj.counties || [] : [];
  }

  //選擇縣市後，更新預設區域為區域陣列第一筆
  function changeCity(id: number) {
    memberForm.regionArr = getCounty(id);
    memberForm.region = memberForm.regionArr[0].id;
  }

  //電話號碼限制10碼
  function phoneFormat() {
    const phone = memberForm.phone;
    if (phone.length > 10) {
      memberForm.phone = phone.slice(0, 10);
    }
  }

  return {
    memberForm,
    formCheck,
    getCounty,
    changeCity,
    phoneFormat,
  };
}
