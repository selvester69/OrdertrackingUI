export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderDate: Date;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  deliveryRate: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export interface ChartData {
  label: string;
  value: number;
  date?: string;
}

export interface StatusDistribution {
  status: OrderStatus;
  count: number;
  percentage: number;
}