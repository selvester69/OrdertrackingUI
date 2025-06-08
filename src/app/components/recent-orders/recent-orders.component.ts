import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { LucideAngularModule, Eye, MoreHorizontal } from 'lucide-angular';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold text-white">Recent Orders</h3>
        <button class="text-gray-400 hover:text-white transition-colors">
          <lucide-icon [img]="MoreHorizontalIcon" size="20"></lucide-icon>
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="text-left py-3 px-2 text-gray-400 font-medium text-sm">Order ID</th>
              <th class="text-left py-3 px-2 text-gray-400 font-medium text-sm">Customer</th>
              <th class="text-left py-3 px-2 text-gray-400 font-medium text-sm">Status</th>
              <th class="text-left py-3 px-2 text-gray-400 font-medium text-sm">Amount</th>
              <th class="text-left py-3 px-2 text-gray-400 font-medium text-sm">Date</th>
              <th class="text-left py-3 px-2 text-gray-400 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              *ngFor="let order of recentOrders; trackBy: trackByOrderId"
              class="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
            >
              <td class="py-4 px-2">
                <span class="font-mono text-sm text-white">{{ order.id }}</span>
              </td>
              <td class="py-4 px-2">
                <div>
                  <p class="text-white font-medium">{{ order.customerName }}</p>
                  <p class="text-gray-400 text-sm">{{ order.customerEmail }}</p>
                </div>
              </td>
              <td class="py-4 px-2">
                <span [class]="getStatusBadgeClass(order.status)">
                  {{ order.status | titlecase }}
                </span>
              </td>
              <td class="py-4 px-2">
                <span class="text-white font-medium">\${{ order.totalAmount.toLocaleString() }}</span>
              </td>
              <td class="py-4 px-2">
                <span class="text-gray-400 text-sm">{{ formatDate(order.orderDate) }}</span>
              </td>
              <td class="py-4 px-2">
                <button class="text-gray-400 hover:text-white transition-colors p-1 rounded">
                  <lucide-icon [img]="EyeIcon" size="16"></lucide-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mt-4 text-center" *ngIf="recentOrders.length === 0">
        <p class="text-gray-400">No orders found for the selected time range.</p>
      </div>
    </div>
  `,
  styleUrls: ['./recent-orders.component.scss']
})
export class RecentOrdersComponent implements OnInit, OnDestroy {
  @Input() timeRange: 'today' | '7d' | '30d' | '90d' | '1y' = '7d';
  
  recentOrders: Order[] = [];
  private destroy$ = new Subject<void>();

  readonly EyeIcon = Eye;
  readonly MoreHorizontalIcon = MoreHorizontal;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadRecentOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(): void {
    this.loadRecentOrders();
  }

  private loadRecentOrders(): void {
    this.orderService.getOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        const filteredOrders = this.orderService.getOrdersByTimeRange(this.timeRange);
        this.recentOrders = filteredOrders
          .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime())
          .slice(0, 10);
      });
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }

  getStatusBadgeClass(status: string): string {
    const baseClass = 'status-badge';
    switch (status) {
      case 'pending': return `${baseClass} status-pending`;
      case 'processing': return `${baseClass} status-processing`;
      case 'shipped': return `${baseClass} status-shipped`;
      case 'delivered': return `${baseClass} status-delivered`;
      case 'cancelled': return `${baseClass} status-cancelled`;
      default: return `${baseClass} status-pending`;
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}