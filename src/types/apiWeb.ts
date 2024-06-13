export interface siteData {
  siteId?: string;
  siteOwnerNo?: string;
  siteName?: string;
  urlSuffix?: string;
  agentId?: string;
  isAType?: string;
  siteType?: string;
  paymentType?: string;
  isUnderCounstruction?: string;
  isExposeToOthers?: string;
  isOthersExposeToMe?: string;
  profitProvided?: string;
  profitGet?: string;
  fixedMarginRate?: string;
  paymentFee?: string;
  contactName?: string;
  contactPhone?: string;
  discountFlag?: string;
  discountName?: string;
  logo?: string;
  logoMobile?: string;
  headerColor?: string;
  favicon?: string;
  b2Info?: B2Info;
  isEligible?: string;
  unShowSupplierIds?: string[];
  subBWebInfos?: any[];
  unShowCategoryIds?: any[];
  websiteGoogleDescription?: string;
  isAsite?: boolean;
  subSiteData?: any[];
}

interface B2Info {
  subSiteName?: string;
  empEmails?: string[];
}