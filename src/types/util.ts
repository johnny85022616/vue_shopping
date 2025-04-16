import type { order } from './order';

/**
 * type為定義的型別或是null
 * ex： type apple = {name: string; count: number}
 * 使用方式： type test = OrNull<apple>
 * 結果： apple | null
 */
type OrNull<T> = T | null;

/**
 * type為定義的型別或是null|undefined
 * ex： type apple = {name: string; count: number}
 * 使用方式： type test = Maybe<apple>
 * 結果： apple | undefined | null;
 */
type Maybe<T> = T | undefined | null;

/**
 * 取得某type或是interface的key集合當作型別
 * ex： type apple = {name: string; count: number}
 * 使用方式： type keys = Keys<apple>
 * 結果： 'name' | 'count'
 */
type Keys<T> = keyof T | string;

/**
 * 取得某type或是interface的value型別組成一個集合
 * ex： type apple = {name: string; count: number}
 * 使用方式： type values = Values<apple>
 * 結果： string | number
 */
type Values<T> = T[keyof T];

/**
 * 取得傳入型別中某個key的型別(也可為多個key)，和T[keyof T]相近但可以只規定取得想要key的型態
 * ex: 拿訂單type order 舉裡
 * 使用方式(取單個key的型別)： type pickKeyType = Values<order, 'dealId'>
 * 結果： string
 * 使用方式(取多個key的型別)： type pickKeyType = Values<order, 'dealId' | 'dealPayAmount'>
 * 結果： string | number
 */
type PickObj<T, U extends keyof T> = T[U];
