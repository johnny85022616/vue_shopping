//單品完整資料(單品頁使用)
export interface productInfo {
  name: string;
  supplierId: number;
  isSoldOut: boolean;
  isIntangible: string;
  price: Price;
  campaignFlags: CampaignFlags;
  sellSetId: number;
  shipmentPreserveId: number;
  startSaleTime: string;
  isSale: boolean;
  isFullRedeem: boolean;
  pid: number;
  images: string[];
  videos: string[];
  tags: string[];
  variants: Variant[];
  promotionLabels: any[];
  [key: string]: any; //供之後vue添加屬性不報錯
}

interface Variant {
  groupTitle: string;
  name: string;
  id: number;
  qty: number;
  isSoldOut: boolean;
  quantityLevel: string;
  purchaseMinQty: number;
  qtyMax: number;
}

interface CampaignFlags {
  k: string;
  v: (string[] | null)[];
}

interface Price {
  memberPrice: number;
  marketPrice: number;
  promoPrice: null;
  bestDiscountA: number;
  bestDiscountO: number;
  bestDiscountPrice: number;
}
