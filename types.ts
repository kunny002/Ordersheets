
export enum ProductType {
  SIMPLE, // Checkbox
  CHOICE, // Radio buttons for options
  GROUPED, // A header for sub-products
}

export interface ProductOption {
  label: string;
  price: number;
}

export interface SubProduct {
    id: string;
    name: string;
    description?: string;
    price: number;
}

export interface Product {
  id: string;
  number: string;
  name: string;
  description?: string;
  type: ProductType;
  price?: number;
  options?: ProductOption[];
  subProducts?: SubProduct[];
}

export interface OrderItem {
  productId: string;
  selected: boolean;
  price: number;
  option?: string;
}

export interface UserDetails {
  childName: string;
  parentName: string;
}

export interface Order {
  items: OrderItem[];
  userDetails: UserDetails;
  totalPrice: number;
}

export enum SubmissionStatus {
  IDLE = 'idle',
  SUBMITTING = 'submitting',
  SUCCESS = 'success',
  ERROR = 'error',
}
