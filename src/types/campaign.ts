interface campaignInfo {
  campaignId: string;
  campaignName: string;
  campaignStartTimestamp: string;
  campaignEndTimestamp: string;
  offerCondition: string[];
  offerContents: OfferContents;
  campaignRange?: ProductRange;
  otherInformation: OtherInformation;
  [key: string]: any;
}

interface OtherInformation {
  imgUrl: string;
  image: string;
  hyperlink?: string;
  campUrl: string;
  fakeCate: string;
}

interface OfferContents {
  discount?: string[];
  digitalSignal: string;
  [key: string]: any;
}

interface ProductRange {
  v: string[];
  k: string;
}
