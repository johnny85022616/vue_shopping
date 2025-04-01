export interface order {
  dealId: string;
  memberId: string;
  orderDate: string;
  shippingType: string;
  payType: string;
  atmPaymentData: AtmPaymentData;
  payment: Payment;
  totalProductPrice: number;
  dealPayAmount: number;
  receiverName: string;
  receiverAddress: string;
  pickupStoreName: null | string;
  pickupStoreAdress: null;
  channelResource: null;
  productData: orderProduct[];
  canReturn: boolean;
  returnPayTypeHintText: string;
  orderTime: string;
  isShowRefundBankForm: boolean;
  isShowRefundBankSelected: boolean;
  isShowReturnAddressForm: boolean;
  isShowProcessStatusBar: boolean;
  isSomeReturnFlag: boolean;
  hasUrgent: boolean;
  smallThan72: boolean;
  isDetilOpen: boolean;
  isCoinsigneeInfoOpen: boolean;
  consigneeNameDetail: null;
  consigneeAddrDetail: null;
  isDiscountInfoOpen: boolean;
  discountInfoDetail: null;
  isGetImgAlready: boolean;
}

export interface orderProduct {
  productId: number;
  sizeId: number;
  orderId: string;
  productName: string;
  colorName: string;
  productType: string;
  parentId: number;
  price: number;
  productDiscount: number;
  productDiscountedPrice: number;
  productPayAmount: number;
  quantity: number;
  logisticName: null | string;
  deliveryNo: null | string;
  logisticUrl: string;
  canReturn: boolean;
  returnFlag: null;
  timestamp: Timestamp;
  isIntangible: string;
  memo: Memo[] | null;
  shipDelay: null;
  unableShipReason: null;
  delayDate: null;
  sortIdx: number;
  isShowShippingDetail: boolean | null | string;
  deliverProcess: DeliverProcess[];
  images: null | string;
  isTicketOpen: boolean;
  tickets: null;
  urgentText: string;
  proofUrl?: string;
  supplierId?: number;
}

export interface DeliverProcess {
  text: string;
  time?: string;
  active: boolean;
}

interface Memo {
  productid: string;
  sn: string;
  barcode: string;
  period: string;
}

export interface Timestamp {
  orderDate: string;
  cfConfidenceDate: null | string;
  tranferDate: null | string;
  shipConfirmDate: null | string;
  handOverDate: null;
  packageInStoreDate: null;
  pickupDate: null;
  arrivalDate: null | string;
  applyReturnDate: string;
  dispatchPickupDate: null;
  confirmNoDefectsDate: null | string;
  refundedDate: null;
}

export interface Payment {
  status: string;
  timestamp: string;
}

export interface AtmPaymentData {
  bank: null;
  account: null;
}
