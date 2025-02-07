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
  couponCategory?: couponCategory;
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

interface couponCategory {
  [key: string]: info;
}

interface info {
  tagTitle: string;
  data: couponCategoryData[];
}

interface couponCategoryData {
  campaignId: string;
  campaignName: string;
  campaignStartTimestamp: string;
  campaignEndTimestamp: string;
  offerCondition: string[];
  offerContents: OfferContents;
  campaignRange: ProductRange;
  otherInformation: OtherInformation;
  ui: Ui;
}

interface Ui {
  digitalType: string;
  discountAmount: number;
  discountCode: string;
  isAnti: boolean;
  isGeted: boolean;
  title: string;
  campaignPageTitle: string;
  rule: string;
  campaignId: string;
  campaignName: string;
  campaignEndTime: string;
  couponExpireTime: string;
  listCampaignEndTime: string;
  campaignUrl: string;
  isShowInMyCampaign: boolean;
  isAdditionalDiscount: boolean;
}

interface OtherInformation {
  imgUrl: string;
  image: string;
  hyperlink: string;
  campSiteUrl: string;
  campUrl: string;
  fakeCate: string;
  mask: number;
}

interface OfferContents {
  d5: D5;
  digitalSignal: string;
}

interface D5 {
  minAmount: string;
  password: string;
  quantity: string;
  d: string;
  productRange: ProductRange;
  discount: string[];
  couponId: number;
}

interface ProductRange {
  v: string[];
  k: string;
}
