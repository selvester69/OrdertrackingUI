import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { OrderStats } from '../../models/order.model';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { OrderChartComponent } from '../order-chart/order-chart.component';
import { RecentOrdersComponent } from '../recent-orders/recent-orders.component';
import { StatusDistributionComponent } from '../status-distribution/status-distribution.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    OrderChartComponent,
    RecentOrdersComponent,
    StatusDistributionComponent
  ],
  template: `
    <div class="space-y-6 pb-6 fade-in">
      <!-- Overview Stats -->
      <section>
        <h2 class="text-2xl font-bold mb-6 text-white">Order Overview</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" *ngIf="stats">
          <app-stat-card
            title="Total Orders"
            [value]="stats.totalOrders.toLocaleString()"
            [change]="8.2"
            icon="package"
            color="blue">
          </app-stat-card>
          
          <app-stat-card
            title="Total Revenue"
            [value]="'$' + stats.totalRevenue.toLocaleString()"
            [change]="12.5"
            icon="dollar-sign"
            color="green">
          </app-stat-card>
          
          <app-stat-card
            title="Avg Order Value"
            [value]="'$' + stats.averageOrderValue.toLocaleString()"
            [change]="3.1"
            icon="trending-up"
            color="purple">
          </app-stat-card>
          
          <app-stat-card
            title="Delivery Rate"
            [value]="stats.deliveryRate + '%'"
            [change]="1.8"
            icon="truck"
            color="orange">
          </app-stat-card>
        </div>
      </section>

      <!-- Charts Section -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <app-order-chart
          title="Revenue Trend"
          type="revenue"
          [timeRange]="timeRange">
        </app-order-chart>
        
        <app-order-chart
          title="Order Volume"
          type="volume"
          [timeRange]="timeRange">
        </app-order-chart>
      </section>

      <!-- Status and Recent Orders -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <app-status-distribution></app-status-distribution>
        
        <div class="lg:col-span-2">
          <app-recent-orders [timeRange]="timeRange"></app-recent-orders>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Input() timeRange: 'today' | '7d' | '30d' | '90d' | '1y' = '7d';
  
  stats: OrderStats | null = null;
  private destroy$ = new Subject<void>();

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.stats = stats;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}