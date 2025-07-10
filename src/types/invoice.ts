export interface invoice {
  invType: string;
  isDefault: string;
  donateId?: string;
  vatNumber?: string;
  companyName?: string;
  type?: number;
  name?: string;
  vehicle?: string | undefined | null;
}