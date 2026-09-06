// TypeScript types representing the database schema and application state

export type UserRole = 'customer' | 'kitchen' | 'cafe' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  available: boolean;
  created_at: string;
}

export type OrderStatus = 'PLACED' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED';

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  menu_items?: MenuItem; // Joined menu item details
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  profiles?: Profile; // Joined customer profile details
  order_items?: OrderItem[]; // Joined order items list
}

export interface Payment {
  id: string;
  order_id: string;
  payment_method: 'card' | 'cash' | 'upi';
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}
