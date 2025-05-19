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

// 新增收貨人api的 payload type，api要求要要多一層data故型別也多加一層data
export type createConsigneePayload = {data : Pick<consignee, 'name' | 'mobile' | 'isDefault'> & Pick<Addr,  'city' | 'county' |  'addr'>};