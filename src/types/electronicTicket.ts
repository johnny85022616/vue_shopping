//電子票券
export interface electronicTicket {
  dealId: string;
  productId: string;
  productName: string;
  manufacturerCode: string;
  images: string;
  sn: string;
  barcode: string;
  period: string;
  isMemoed: boolean;
}
