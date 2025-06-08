import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, OrderStats, ChartData, StatusDistribution, OrderStatus } from '../models/order.model';
import { format, subDays, subMonths, subYears } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private statsSubject = new BehaviorSubject<OrderStats | null>(null);

  constructor() {
    this.generateMockData();
  }

  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  getStats(): Observable<OrderStats | null> {
    return this.statsSubject.asObservable();
  }

  getOrdersByTimeRange(timeRange: string): Order[] {
    const orders = this.ordersSubject.value;
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'today':
        startDate = subDays(now, 1);
        break;
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '90d':
        startDate = subDays(now, 90);
        break;
      case '1y':
        startDate = subYears(now, 1);
        break;
      default:
        startDate = subDays(now, 7);
    }

    return orders.filter(order => order.orderDate >= startDate);
  }

  getRevenueChartData(timeRange: string): ChartData[] {
    const orders = this.getOrdersByTimeRange(timeRange);
    const groupedData = new Map<string, number>();

    orders.forEach(order => {
      const dateKey = format(order.orderDate, 'MMM dd');
      const currentValue = groupedData.get(dateKey) || 0;
      groupedData.set(dateKey, currentValue + order.totalAmount);
    });

    return Array.from(groupedData.entries()).map(([date, value]) => ({
      label: date,
      value,
      date
    }));
  }

  getOrderVolumeChartData(timeRange: string): ChartData[] {
    const orders = this.getOrdersByTimeRange(timeRange);
    const groupedData = new Map<string, number>();

    orders.forEach(order => {
      const dateKey = format(order.orderDate, 'MMM dd');
      const currentValue = groupedData.get(dateKey) || 0;
      groupedData.set(dateKey, currentValue + 1);
    });

    return Array.from(groupedData.entries()).map(([date, value]) => ({
      label: date,
      value,
      date
    }));
  }

  getStatusDistribution(): StatusDistribution[] {
    const orders = this.ordersSubject.value;
    const statusCounts = new Map<OrderStatus, number>();
    
    orders.forEach(order => {
      const currentCount = statusCounts.get(order.status) || 0;
      statusCounts.set(order.status, currentCount + 1);
    });

    const total = orders.length;
    return Array.from(statusCounts.entries()).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  }

  private generateMockData(): void {
    const orders = this.generateMockOrders();
    this.ordersSubject.next(orders);
    this.statsSubject.next(this.calculateStats(orders));
  }

  private generateMockOrders(): Order[] {
    const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const customers = [
      { name: 'John Smith', email: 'john.smith@email.com' },
      { name: 'Sarah Johnson', email: 'sarah.j@email.com' },
      { name: 'Michael Brown', email: 'mike.brown@email.com' },
      { name: 'Emily Davis', email: 'emily.davis@email.com' },
      { name: 'David Wilson', email: 'david.w@email.com' },
      { name: 'Lisa Anderson', email: 'lisa.anderson@email.com' },
      { name: 'James Taylor', email: 'james.taylor@email.com' },
      { name: 'Jennifer Martinez', email: 'jen.martinez@email.com' }
    ];

    const products = [
      { name: 'Wireless Bluetooth Headphones', price: 89.99 },
      { name: 'Smart Fitness Watch', price: 199.99 },
      { name: 'Portable Phone Charger', price: 29.99 },
      { name: 'Bluetooth Speaker', price: 79.99 },
      { name: 'Laptop Stand', price: 49.99 },
      { name: 'Wireless Mouse', price: 39.99 },
      { name: 'USB-C Hub', price: 69.99 },
      { name: 'Phone Case', price: 19.99 }
    ];

    return Array.from({ length: 150 }, (_, i) => {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const orderDate = subDays(new Date(), Math.floor(Math.random() * 90));
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const itemCount = Math.floor(Math.random() * 3) + 1;
      const items = Array.from({ length: itemCount }, () => {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        return {
          id: `item-${Math.random().toString(36).substr(2, 9)}`,
          name: product.name,
          quantity,
          price: product.price
        };
      });

      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        id: `ORD-${String(i + 1).padStart(6, '0')}`,
        customerName: customer.name,
        customerEmail: customer.email,
        orderDate,
        status,
        totalAmount: Math.round(totalAmount * 100) / 100,
        items,
        shippingAddress: {
          street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        trackingNumber: status === 'shipped' || status === 'delivered' ? `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined,
        estimatedDelivery: status === 'shipped' ? subDays(new Date(), -Math.floor(Math.random() * 7) - 1) : undefined,
        actualDelivery: status === 'delivered' ? subDays(orderDate, -Math.floor(Math.random() * 14) - 3) : undefined
      };
    });
  }

  private calculateStats(orders: Order[]): OrderStats {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalRevenue / totalOrders;
    
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<OrderStatus, number>);

    const deliveredOrders = statusCounts.delivered || 0;
    const deliveryRate = (deliveredOrders / totalOrders) * 100;

    return {
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      pendingOrders: statusCounts.pending || 0,
      processingOrders: statusCounts.processing || 0,
      shippedOrders: statusCounts.shipped || 0,
      deliveredOrders: statusCounts.delivered || 0,
      cancelledOrders: statusCounts.cancelled || 0
    };
  }
}