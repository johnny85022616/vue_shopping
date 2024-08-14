export interface aiProduct{
  auto_category_id_M_c?: string;
  ek?: number;
  image_url?: string;
  auto_category_id_L_c: string;
  ek_l2a?: number;
  auto_category_id_b_c: string;
  pid: number;
  auto_category_id_b: string;
  auto_category_id_c: string;
  name?: string;
  auto_category_id_L: string;
  auto_category_id_M: string;
  auto_category_id: string;
  new_date?: number;
  brand?: string;
  kids_show?: Kidsshow[];
  kids?: Kidsshow[];
  [key:string]:any //供之後vue添加屬性不報錯
}

interface Kidsshow {
  k_score?: number;
  kid?: number;
  kcontent?: string;
}