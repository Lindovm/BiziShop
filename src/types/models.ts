// User-related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'cashier' | 'manager' | 'owner';
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  restaurant_id?: any; // Reference to a document in the restaurants collection
}

// Product-related types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string;
  cost?: number;
  barcode?: string;
  sku?: string;
  tags?: string[];
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  order?: number;
}

// Inventory-related types
export interface InventoryItem {
  id: string;
  productId: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  unit: string;
  lastRestocked?: string;
  supplier?: string;
  cost: number;
  status: 'ok' | 'low' | 'out';
  location?: string;
  expiryDate?: string;
  updatedAt?: string; // Added updatedAt
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  date: string;
  performedBy: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

// Order-related types
export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  customer?: Customer;
  notes?: string;
  discount?: number;
  discountCode?: string;
  cashierId: string;
  tableNumber?: string;
  orderType: 'dine-in' | 'takeaway' | 'delivery';
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  options?: OrderItemOption[];
}

export interface OrderItemOption {
  name: string;
  value: string;
  price: number;
}

export interface Customer {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  isRegistered?: boolean;
}

// Payment-related types
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  isActive: boolean;
  requiresVerification?: boolean;
  icon?: string;
}

// Analytics-related types
export interface DailySales {
  date: string;
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  topSellingItems: {
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface InventoryAlert {
  id: string;
  inventoryItemId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  status: 'low' | 'out';
  createdAt: string;
}

// Notification-related types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

// Restaurant-related types
export interface Restaurant {
  id: string;
  name: string;
  address?: string | { street?: string; city?: string; [key: string]: any };
  phone?: string;
  email?: string;
  logo_url?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt?: string;
  is_open?: boolean;
  operating_hours?: string;
}

// Settings-related types
export interface ShopSettings {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  currency: string;
  taxRate: number;
  businessHours?: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  receiptFooter?: string;
  receiptHeader?: string;
}

// Review-related types
export interface Review {
  id: string;
  restaurantId: string; // or shopId, depending on your main identifier
  userId?: string; // Optional: if reviews are linked to users
  orderId?: string; // Optional: if reviews are linked to specific orders
  rating: number; // e.g., 1-5
  comment?: string;
  createdAt: string;
  updatedAt?: string;
  reviewerName?: string; // If not linked to a user, or for display
}
