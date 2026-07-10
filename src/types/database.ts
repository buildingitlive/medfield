/**
 * Supabase Database type definitions.
 * Maps to the PostgreSQL schema defined in supabase/schema.sql.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProductForm = 'Tablet' | 'Capsule' | 'Tincture' | 'Extract' | 'Topical';
export type ProductCategory = 'Botanical' | 'Analgesic' | 'Cardiac' | 'Immunology' | 'Wellness';
export type OrderStatus =
  | 'Order Placed'
  | 'Verified by Pharmacy'
  | 'Dispatched from Field Warehouse'
  | 'Out for Delivery'
  | 'Delivered';
export type PrescriptionStatus = 'pending' | 'verified' | 'rejected';
export type MemberTier = 'standard' | 'premium' | 'clinical';
export type PaymentMethod = 'COD' | 'QR';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          avatar_url: string | null;
          member_tier: MemberTier;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          phone?: string | null;
          avatar_url?: string | null;
          member_tier?: MemberTier;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          member_tier?: MemberTier;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          generic_name: string;
          dosage: string;
          form: ProductForm;
          price: number;
          mrp: number;
          in_stock: boolean;
          requires_prescription: boolean;
          grower_name: string;
          grower_location: string;
          grower_certification: string;
          grower_purity_score: number;
          batch_number: string;
          harvest_date: string;
          description: string;
          image_url: string;
          category: ProductCategory;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          generic_name: string;
          dosage: string;
          form: ProductForm;
          price: number;
          mrp: number;
          in_stock?: boolean;
          requires_prescription?: boolean;
          grower_name: string;
          grower_location: string;
          grower_certification?: string;
          grower_purity_score?: number;
          batch_number: string;
          harvest_date: string;
          description: string;
          image_url: string;
          category: ProductCategory;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          recipient_name: string;
          phone: string | null;
          street: string;
          city: string;
          state: string;
          zip: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          recipient_name: string;
          phone?: string | null;
          street: string;
          city: string;
          state: string;
          zip: string;
          is_default?: boolean;
        };
        Update: Partial<Omit<Database['public']['Tables']['addresses']['Insert'], 'user_id'>>;
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity: number;
        };
        Update: {
          quantity?: number;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: OrderStatus;
          total: number;
          delivery_fee: number;
          estimated_delivery: string;
          payment_method: PaymentMethod;
          address_snapshot: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: OrderStatus;
          total: number;
          delivery_fee: number;
          estimated_delivery: string;
          payment_method: PaymentMethod;
          address_snapshot: Json;
        };
        Update: {
          status?: OrderStatus;
          estimated_delivery?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_snapshot: Json;
          quantity: number;
          unit_price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_snapshot: Json;
          quantity: number;
          unit_price: number;
        };
        Update: Record<string, never>;
      };
      order_tracking_steps: {
        Row: {
          id: string;
          order_id: string;
          title: string;
          description: string;
          timestamp: string;
          completed: boolean;
          step_order: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          title: string;
          description: string;
          timestamp: string;
          completed?: boolean;
          step_order: number;
        };
        Update: {
          completed?: boolean;
          timestamp?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
        };
        Update: Record<string, never>;
      };
      prescriptions: {
        Row: {
          id: string;
          user_id: string;
          file_url: string;
          file_name: string;
          status: PrescriptionStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_url: string;
          file_name: string;
          status?: PrescriptionStatus;
          notes?: string | null;
        };
        Update: {
          status?: PrescriptionStatus;
          notes?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Convenience type aliases for row types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Address = Database['public']['Tables']['addresses']['Row'];
export type CartItemRow = Database['public']['Tables']['cart_items']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type OrderTrackingStep = Database['public']['Tables']['order_tracking_steps']['Row'];
export type Favorite = Database['public']['Tables']['favorites']['Row'];
export type Prescription = Database['public']['Tables']['prescriptions']['Row'];

// Joined types for UI consumption
export interface CartItemWithProduct {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product?: Product })[];
  tracking_steps: OrderTrackingStep[];
}
