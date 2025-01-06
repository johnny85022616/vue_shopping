export interface siteData {
  siteId?: string;
  siteOwnerNo?: string;
  supplierId?: string;
  siteName?: string;
  urlSuffix?: string;
  agentId?: string;
  isAType?: string;
  siteType: string;
  paymentType?: string;
  isUnderCounstruction?: string;
  isExposeToOthers?: string;
  isOthersExposeToMe?: string;
  profitProvided?: string;
  profitGet?: string;
  fixedMarginRate?: string;
  paymentFee?: string;
  freight?: string;
  freightDiscountCondition?: string;
  contactName?: string;
  contactPhone?: string;
  discountFlag?: string;
  logo?: string;
  logoMobile?: string;
  headerColor?: string;
  favicon?: string;
  isEligible?: string;
  categoryIdL?: string;
  skuCount?: string;
  unShowSupplierIds?: string[];
  subBWebInfos?: any[];
  unShowCategoryIds?: string[];
  websiteGoogleName?: string;
  websiteGoogleDescription?: string;
  b2Info: B2Info;
  b4Info: B4Info;
  [key: string]: any;
}

interface B2Info {
  subSiteName?: string;
  empEmails?: string[];
}
interface B4Info {
  themeType: string;
  supplierIds: string[];
  kws: string;
}
