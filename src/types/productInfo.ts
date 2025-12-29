//單品完整資料(單品頁使用)

//------------------------new productInfo------------------------

export interface productInfo {
  type: '1' | '2' | '3' | 'A' | 'B' | 'C';
  name: string;
  qtyava: boolean;
  nPid: number;
  images: string[];
  supplierId: number;
  isIntangible: string;
  memberPrice: number;
  quantityLevel: string;
  campaignFlags: CampaignFlags |string[];
  sellSetId: number;
  shipmentPreserveId: number;
  isSale: boolean;
  isFullRedeem: boolean;
  exposureRestriction: boolean;
  isNotSingleSale: boolean;
  pageId: string;
  videos: string[];
  flags: string[];
  variants: Variant2[];
  tags: string[];
  pid: string;
  isShowSingleSpec: boolean;
  isShowMultiSpec: boolean;
  isShowMultiSpecPrice: boolean;
  isChangeQuantity: boolean;
  isChangeSpecInCart: boolean;
  isSyncPriceToPage: boolean;
  price: number;
  comboProducts: Variant2[];
  cartPayload: CartPayload;
  payMethodList: string[];
  deliveryInfos: DeliveryInfo[];
  couponCategory: couponCategory;
  groupSpec?: GroupSpec | null;
  [key:string]: any
}

interface DeliveryInfo {
  deliveryType: string;
  cartTypeId: number;
  deliveryName: string;
}

interface CartPayload {
  add: Add;
}

interface Add {
  transportationType: number;
  pageType: string;
  pid: string;
  prdName: string;
  imageUrl: string;
  quantity: number;
  comboChildProducts: ComboChildProduct[];
}

interface ComboChildProduct {
  pid: string;
  sku: string;
  quantity: number;
  isHeadPrd?: boolean;
  name: string;
  groupId?: string;
  group1Content: string;
  group2Content: string;
  productLevel?: boolean;
}

export interface Variant2 {
  name: string;
  qtyava: boolean;
  productLevel: string;
  quantityLevel: string;
  equivalentPrice: number;
  images: string[];
  skuId: string;
  groupId?: string;
  group1Content?: string;
  group2Content?: string;
  supplierId: number;
  sellSetId: number;
  isIntangible: string;
  extenQty: number;
  pageId: string;
  nPid: number;
  qty: number;
  qtyMin: number;
  pid: string;
  image_url: string;
  campaignFlags: CampaignFlags |string[];
  type: string;
  memberPrice: number;
  shipmentPreserveId: number;
  isSale: boolean;
  isFullRedeem: boolean;
  exposureRestriction: boolean;
  isNotSingleSale: boolean;
  videos: string[];
  flags: string[];
  variants: Variant[];
  groupSpec?: GroupSpec ;
  bestDiscountPrice?: number;
  brand?: string;
  qtyMax?: number
  group1Title?: string;
  group2Title?: string;
}

export interface GroupSpec {
  firstSpec: FirstSpec;
  secondSpec?: SecondSpec;
  isSpecFirstShow?: boolean;
  isSpecSecondShow?: boolean;
}
interface FirstSpec {
  title: string;
  options: Options;
  isSpecFirstShow: boolean;
}
interface SecondSpec {
  title: string;
  options: Options2;
  isSpecSecondShow: boolean;
}
interface Options {
  [key: string]: OptionsObj;
}
interface Options2 {
  [key:string]: OptionsObj[];
}

interface OptionsObj {
  pageId: string;
  skuId: string;
  name: string;
  qtyava: boolean;
  qty: number;
  qtyMin: number;
  memberPrice: number;
  image_url: string;
}

interface Variant {
  name: string;
  qtyava: boolean;
  quantityLevel: string;
  memberPrice: number;
  images: string[];
  skuId: string;
  groupId?: string;
  group1Title?: string;
  group2Title?: string;
  group1Content?: string;
  group2Content?: string;
  supplierId: number;
  sellSetId: number;
  isIntangible: string;
  campaignFlags: CampaignFlags;
  pageId: string;
  nPid: number;
  isHeadPrd?: boolean;
}

export interface CampaignFlags {
  k: string;
  v: (string[] | null)[];
}

export interface couponCategory {
  [key: string]: info;
}

export interface info {
  tagTitle: string;
  data: couponCategoryData[];
}

export interface couponCategoryData {
  campaignId: string;
  campaignName: string;
  campaignStartTimestamp: string;
  campaignEndTimestamp: string;
  offerCondition: string[];
  offerContents: OfferContents;
  campaignRange: ProductRange;
  otherInformation: OtherInformation;
  couponType?: string; //coupon代號
  childCampaignInfo?: any;
  ui: Ui;
}

export interface Ui {
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
  campaignSiteName?: string;
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
  [key: string]: any;
  digitalSignal: string;
}