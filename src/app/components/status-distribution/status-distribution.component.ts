import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { OrderService } from '../../services/order.service';
import { StatusDistribution } from '../../models/order.model';

Chart.register(...registerables);

@Component({
  selector: 'app-status-distribution',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300">
      <h3 class="text-lg font-semibold text-white mb-6">Order Status Distribution</h3>
      
      <div class="relative h-64 mb-6">
        <canvas #chartCanvas></canvas>
      </div>
      
      <div class="space-y-3">
        <div 
          *ngFor="let item of statusData; let i = index"
          class="flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div 
              class="w-3 h-3 rounded-full"
              [style.background-color]="getStatusColor(i)"
            ></div>
            <span class="text-gray-300 capitalize">{{ item.status }}</span>
          </div>
          <div class="text-right">
            <span class="text-white font-medium">{{ item.count }}</span>
            <span class="text-gray-400 text-sm ml-1">({{ item.percentage }}%)</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./status-distribution.component.scss']
})
export class StatusDistributionComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  statusData: StatusDistribution[] = [];
  private chart: Chart | null = null;
  
  private colors = [
    '#F59E0B', // pending - yellow
    '#3B82F6', // processing - blue  
    '#8B5CF6', // shipped - purple
    '#10B981', // delivered - green
    '#EF4444'  // cancelled - red
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadStatusData();
    this.createChart();
  }

  private loadStatusData(): void {
    this.statusData = this.orderService.getStatusDistribution();
  }

  private createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'doughnut' as ChartType,
      data: {
        labels: this.statusData.map(item => item.status.charAt(0).toUpperCase() + item.status.slice(1)),
        datasets: [{
          data: this.statusData.map(item => item.count),
          backgroundColor: this.colors.slice(0, this.statusData.length),
          borderColor: '#1F2937',
          borderWidth: 2,
          hoverBorderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // cutout: '60%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1F2937',
            titleColor: '#F9FAFB',
            bodyColor: '#F9FAFB',
            borderColor: '#374151',
            borderWidth: 1,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = this.statusData.reduce((sum, item) => sum + item.count, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          // animateRotate: true,
          duration: 1000
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  getStatusColor(index: number): string {
    return this.colors[index] || '#6B7280';
  }
}