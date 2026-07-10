export interface FieldGrower {
  id: string;
  name: string;
  location: string;
  certificationNumber: string;
  verified: boolean;
  purityScore: number;
}

export interface MedicineProduct {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: 'Tablet' | 'Capsule' | 'Tincture' | 'Extract' | 'Topical';
  price: number;
  inStock: boolean;
  requiresPrescription: boolean;
  grower: FieldGrower;
  batchNumber: string;
  harvestDate: string;
  description: string;
  imageUrl: string;
  category: 'Botanical' | 'Analgesic' | 'Cardiac' | 'Immunology' | 'Wellness';
}

export interface CartItem {
  product: MedicineProduct;
  quantity: number;
}

export interface Address {
  id: string;
  recipientName?: string;
  phone?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}
export type DeliveryAddress = Address & { zipCode?: string };


export interface Order {
  id: string;
  date: string;
  status: 'Order Placed' | 'Verified by Pharmacy' | 'Dispatched from Field Warehouse' | 'Out for Delivery' | 'Delivered';
  items: CartItem[];
  total: number;
  estimatedDelivery: string;
  trackingSteps: {
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }[];
}
