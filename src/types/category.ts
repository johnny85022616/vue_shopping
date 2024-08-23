export interface category {
  target: string;
  target_value: string;
  target_ss: string;
  list_fun: string;
  list_args: string;
  list_remote: string;
  list_cmpn: string;
  flag_id: number;
  flag_code: number;
  flag_info: string;
  num: number;
  pids: string[];
  groupings?: catg[];
  pids_category: any[];
  list_method: any;
  list_parameters: any;
  list_total: number;
  list_chunk: number;
  list_page: number;
  catg1?: catg[];
  catg2?: catg[];
  catg1_brief: any;
  brand_list: any;
  personalKids: any;
  l_pattern: Lpattern[];
}

interface group {
  cid: string;
  name: string;
  list: string[];
  img_url?: string;
  sub?: group;
}

export interface catg {
  [key:string]: group;
}

interface Lpattern {
  [key:string]:string
}