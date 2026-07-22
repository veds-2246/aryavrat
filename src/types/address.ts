export type AddressLabel =
  | 'Home'
  | 'Office'
  | 'Other';

export interface Address {
  id: string;

  fullName: string;

  phoneNumber: string;

  house: string;

  area: string;

  landmark?: string;

  city: string;

  pinCode: string;

  label: AddressLabel;

  isDefault: boolean;
}