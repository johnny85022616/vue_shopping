export interface creditCard {
  number: string;
  name: string;
  expiration: string;
  cardName: string;
  isDefault: string;
  expressCheckoutId: string;
  bankId: string;
  bankName: string;
  creditCardType: number;
  lastFourDigits: string;
  temp: boolean;
  isChose?: boolean;
}

export type addCreditCardPayload = Pick<creditCard, 'number' | 'name' | 'expiration' | 'isDefault' | 'temp'>;
export type updateCreditCardPayload = Pick<creditCard, 'expressCheckoutId' | 'isDefault'>;
