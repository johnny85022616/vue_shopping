export interface keyword {
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
  kids: Kid[];
  kids_show: Kid[];
  pids: Pid[];
}

export interface Pid {
  pid: string;
  kids_show: Kid2[];
  kids: Kid2[];
}

export interface Kid2 {
  kid: number;
  kcontent: string;
}

export interface Kid {
  [key: string]: kids;
}

export interface kids {
  [key: string]: string;
}
