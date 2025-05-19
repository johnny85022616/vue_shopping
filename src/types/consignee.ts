export interface consignee {
  id: string;
  name: string;
  addr: Addr;
  mobile: string;
  isDefault: string;
  isDefaultBoolean?: boolean; 
}

export interface Addr {
  zip: string;
  city: number;
  county: number;
  fullAddress: string;
  addr: string;
  cityName: string;
  countyName: string;
}

export type createConsigneePayload = Pick<consignee, 'name' | 'mobile' | 'isDefault'> & Pick<Addr,  'city' | 'county' |  'addr'>;