export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  is_new?: boolean;
  is_sale?: boolean;
  stock_quantity?: number;
  discount_percentage?: number;
}

export interface LookbookItem {
  id: string;
  title: string;
  image: string;
  description: string;
  products: string[]; // Array of product IDs
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items: {
    product_id: string;
    quantity: number;
    size: string;
  }[];
}
