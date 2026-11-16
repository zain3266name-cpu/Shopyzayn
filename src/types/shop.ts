export type CategoryName =
  | 'All'
  | 'Electronics'
  | 'Fashion'
  | 'Home & Kitchen'
  | 'Beauty'
  | 'Watches'
  | 'Accessories'
  | 'Sports';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'discount-desc';

export interface ProductVariant {
  id: string;
  label: string;
  colorHex?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Exclude<CategoryName, 'All'>;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  featured: boolean;
  shortTag?: string;
  image: string;
  description: string;
  highlights: string[];
  variants: ProductVariant[];
  sizes?: string[];
  specs: ProductSpec[];
}

export interface CartItem {
  key: string;
  product: Product;
  variantLabel: string;
  sizeLabel?: string;
  quantity: number;
}

export interface DemoOrderReceipt {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  paymentMethod: 'cod' | 'card-demo';
  whatsappUrl: string;
  whatsappMessage: string;
  items: CartItem[];
  subtotal: number;
  promoDiscount: number;
  shippingFee: number;
  total: number;
  placedAt: string;
}
