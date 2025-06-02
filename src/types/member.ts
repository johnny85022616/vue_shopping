interface Member {
  memberId: number;
  fetId: number;
  user: string;
  idNumber: string;
  name: string;
  email: string;
  gender: number;
  birthdayDate: string;
  address: string;
  zipCode: string;
  activatedStatus: number;
  invoiceDevice: InvoiceDevice;
  appliedAt: string;
  password: string;
  isfirst: boolean;
  fetLife: boolean;
  isFetnet: boolean;
  sendSms: boolean;
  sendEdm: boolean;
  addr: Addr;
  oauthEmail: string;
  oauthType: string;
  mobile: string;
}

interface Addr {
  zipCode: string;
  cityId: number;
  cityName: string;
  countyId: number;
  countyName: string;
  fullAddress: string;
  partialAddress: string;
}

interface InvoiceDevice {
  id: string;
  memberId: number;
  token: string;
}