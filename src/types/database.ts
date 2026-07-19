/**
 * Supabase Database type definitions.
 * Maps to the PostgreSQL schema defined in supabase/ SQL files.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProductForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Tincture' | 'Extract' | 'Topical' | 'Powder' | 'Drop';
export type ProductCategory = 'Botanical' | 'Allopathy' | 'Ayush' | 'Analgesic' | 'Cardiac' | 'Immunology' | 'Wellness';
export type OrderStatus =
  | 'Pending Confirmation'
  | 'Order Confirmed'
  | 'Order Placed'
  | 'Verified by Pharmacy'
  | 'Dispatched from Field Warehouse'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';
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
          latitude: number | null;
          longitude: number | null;
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
          latitude?: number | null;
          longitude?: number | null;
        };
        Update: Partial<Omit<Database['public']['Tables']['addresses']['Insert'], 'user_id'>>;
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
          prescription_url: string | null;
          prescription_id: string | null;
          medicine_text: string | null;
          notes: string | null;
          discount_percent: number;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: OrderStatus;
          total?: number;
          delivery_fee?: number;
          estimated_delivery?: string;
          payment_method?: PaymentMethod;
          address_snapshot?: Json;
          prescription_url?: string | null;
          prescription_id?: string | null;
          medicine_text?: string | null;
          notes?: string | null;
          discount_percent?: number;
        };
        Update: {
          status?: OrderStatus;
          total?: number;
          estimated_delivery?: string;
          discount_percent?: number;
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
      order_confirmed_items: {
        Row: {
          id: string;
          order_id: string;
          medicine_name: string;
          company: string | null;
          quantity: number;
          mrp: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          medicine_name: string;
          company?: string | null;
          quantity?: number;
          mrp?: number;
          price?: number;
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
      user_prescriptions: {
        Row: {
          id: string;
          user_id: string;
          patient_name: string;
          prescription_url: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          patient_name?: string;
          prescription_url?: string | null;
          notes?: string | null;
        };
        Update: {
          patient_name?: string;
          notes?: string | null;
        };
      };
      user_prescription_items: {
        Row: {
          id: string;
          prescription_id: string;
          medicine_name: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          prescription_id: string;
          medicine_name: string;
          quantity?: number;
        };
        Update: Record<string, never>;
      };
      admin_products: {
        Row: {
          id: string;
          medicine_name: string;
          company: string | null;
          mrp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          medicine_name: string;
          company?: string | null;
          mrp?: number;
        };
        Update: {
          medicine_name?: string;
          company?: string | null;
          mrp?: number;
          updated_at?: string;
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
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type OrderConfirmedItem = Database['public']['Tables']['order_confirmed_items']['Row'];
export type OrderTrackingStep = Database['public']['Tables']['order_tracking_steps']['Row'];
export type Favorite = Database['public']['Tables']['favorites']['Row'];
export type UserPrescription = Database['public']['Tables']['user_prescriptions']['Row'];
export type UserPrescriptionItem = Database['public']['Tables']['user_prescription_items']['Row'];
export type AdminProduct = Database['public']['Tables']['admin_products']['Row'];

// Joined types for UI consumption
export interface PrescriptionWithItems extends UserPrescription {
  items: UserPrescriptionItem[];
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product?: Product })[];
  confirmed_items?: OrderConfirmedItem[];
  tracking_steps: OrderTrackingStep[];
}
