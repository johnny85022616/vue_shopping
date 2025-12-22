// product/v2/productinfo取得商品列表api回來的商品型態
export interface product {
  nPid: number;
  name: string;
  images: string;
  skuId: string;
  memberPrice: number;
  qtyava: boolean;
  pageId: string;
  supplierId: number;
  isQuantity: number;
  pid: string;
  productId: string;
  price: number;
  image_url: string;
  priceSuffix?: string;
  bestDiscountPriceSuffix?: string
  bestDiscountLabel?: string;
  [key: string]: any; //供之後vue添加屬性不報錯
}

export interface productsObj {
  [key: number]: product;
}
