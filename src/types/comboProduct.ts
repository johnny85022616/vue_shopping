//組合商品api回來的組合商品型態
export interface comboProduct {
  comboId: number;
  comboQty: number;
  refProduct: RefProduct;
}

interface RefProduct {
  name: string;
  intro: string;
  supplierId: number;
  isSoldOut: boolean;
  isIntangible: string;
  sellSetId: number;
  pid: number;
  images: string[];
  videos: any[];
  tags: string[];
  variants: Variant[];
  promotionLabels: any[];
}

export interface Variant {
  groupTitle: string;
  name: string;
  id: number;
  qty: number;
  isSoldOut: boolean;
  quantityLevel: string;
  purchaseMinQty: number;
  qtyMax: number;
}
