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
  discountInfoDetail: any;
  isGetImgAlready: boolean;
  [key: string]: any;
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
  canReturn: boolean | string;
  returnFlag: null;
  timestamp: Timestamp;
  isIntangible: string;
  memo: Memo[] | null;
  shipDelay: null;
  unableShipReason: null;
  delayDate: null;
  sortIdx: number;
  isShowShippingDetail: boolean | null | string;
  deliverProcess: (DeliverProcess | null)[];
  images: null | string;
  isTicketOpen: boolean;
  tickets: any;
  urgentText: string;
  proofUrl?: string;
  supplierId?: number;
  [key: string]: any;
}

export interface DeliverProcess {
  text?: string | null | undefined;
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
  handOverDate: null | string;
  packageInStoreDate: null | string;
  pickupDate: null | string;
  arrivalDate: null | string;
  applyReturnDate: null | string;
  dispatchPickupDate: null | string;
  confirmNoDefectsDate: null | string;
  refundedDate: null | string;
}

export interface Payment {
  status: string;
  timestamp: string;
}

export interface AtmPaymentData {
  bank: null;
  account: null;
}

// ------------------- 貨態明細資料 -------------------

export interface deliverTrack {
  timestamp: string;
  delivery_no: string;
  logistics: string;
  history: History[];
}

export interface History {
  status: string;
  date_time: string;
  formatDate?: string;
}

// ------------------- 問答紀錄 -------------------

export interface qa {
  [key: string]: qaInfo;
}

//QA對話資料
export interface qaInfo {
  caseId: string;
  caseNo: string;
  question: string;
  createTime: string; // api傳回訊息創建時間
  formatDate: string; // api傳回訊息創建時間轉換為要顯示的時間格式
  date: number; //api傳回訊息創建時間getTime(供排序用)
  sizeId: string;
  status: number;
  replyId: string;
  reply: string;
}
//QA類型下拉框資料
export interface qaCategory {
  categoryId: string;
  categoryName: string;
}
