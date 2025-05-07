/**
 * 拆解 Promise 型別，取得其內部型別
 * ex: type Resolved = UnwrapPromise<Promise<string>> // string
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : never;

/**
 * 推斷陣列元素型別
 * ex: type Elem = ArrayElement<number[]> // number
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

/**
 * 推斷函式回傳型別 (ReturnType 的簡化版)
 * ex: type Ret = FnReturnType<() => number> // number
 */
export type FnReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

/**
 * 遞迴將所有屬性設為 readonly
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * 遞迴將所有屬性設為 optional
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * 移除物件型別中 value 為 undefined 的 key
 */
export type Defined<T> = {
  [P in keyof T as undefined extends T[P] ? never : P]: T[P];
};
import type { order } from './order';

/**
 * type為定義的型別或是null
 * ex： type apple = {name: string; count: number}
 * 使用方式： type test = OrNull<apple>
 * 結果： apple | null
 */
export type OrNull<T> = T | null;

/**
 * type為定義的型別或是null|undefined
 * ex： type apple = {name: string; count: number}
 * 使用方式： type test = Maybe<apple>
 * 結果： apple | undefined | null;
 */
export type Maybe<T> = T | undefined | null;

/**
 * 取得某type或是interface的key集合當作型別
 * ex： type apple = {name: string; count: number}
 * 使用方式： type keys = Keys<apple>
 * 結果： 'name' | 'count'
 */
export type Keys<T> = keyof T | string;

/**
 * 取得某type或是interface的value型別組成一個集合
 * ex： type apple = {name: string; count: number}
 * 使用方式： type values = Values<apple>
 * 結果： string | number
 */
export type Values<T> = T[keyof T];

/**
 * 取得傳入型別中某個key的型別(也可為多個key)，和T[keyof T]相近但可以只規定取得想要key的型態
 * ex: 拿訂單type order 舉裡
 * 使用方式(取單個key的型別)： type pickKeyType = Values<order, 'dealId'>
 * 結果： string
 * 使用方式(取多個key的型別)： type pickKeyType = Values<order, 'dealId' | 'dealPayAmount'>
 * 結果： string | number
 */
export type PickObj<T, U extends keyof T> = T[U];

// -------- 以下在typescript utility中都有 --------
//全部變為optional
type partial<T> = { [K in keyof T]?: string };

//排除type中的指定key與value組成新的type，並將指定的key變為optional
type Optional<T extends object, K extends keyof T = keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

//全部變為 readonly
type Readonly<T> = { readonly [K in keyof T]: string };

//選取type中的指定key與value組成新的type
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

//排除type中的指定key與value組成新的type
type Omit<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>>;
