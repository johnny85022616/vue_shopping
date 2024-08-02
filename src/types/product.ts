export interface product {
  productId: number;
  name: string;
  images?: string;
  marketPrice?: number;
  price?: number;
  promoPrice?: number;
  isQuantity?: number;
  isIntangible?: number;
  isStore?: number;
  campaignQty?: number;
  auto_category_id_L?: string;
  auto_category_id_L_c?: string;
  auto_category_id_M?: string;
  auto_category_id_M_c?: string;
  auto_category_id?: string;
  auto_category_id_c?: string;
  [key:string]:any //供之後vue添加屬性不報錯
}
export interface productsObj{
  [key: number]: product
}