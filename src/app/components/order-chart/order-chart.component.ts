import { Component, Input, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { OrderService } from '../../services/order.service';
import { ChartData } from '../../models/order.model';

Chart.register(...registerables);

@Component({
  selector: 'app-order-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <h3 class="text-lg font-semibold text-white mb-4">{{ title }}</h3>
      <div class="relative h-80">
        <canvas #chartCanvas></canvas>
      </div>
    </div>
  `,
  styleUrls: ['./order-chart.component.scss']
})
export class OrderChartComponent implements OnInit, OnChanges {
  @Input() title = '';
  @Input() type: 'revenue' | 'volume' = 'revenue';
  @Input() timeRange: 'today' | '7d' | '30d' | '90d' | '1y' = '7d';
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.updateChart();
    }
  }

  private createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.getChartData();
    const isRevenue = this.type === 'revenue';

    const config: ChartConfiguration = {
      type: 'line' as ChartType,
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          label: isRevenue ? 'Revenue' : 'Orders',
          data: data.map(d => d.value),
          borderColor: isRevenue ? '#10B981' : '#6366F1',
          backgroundColor: isRevenue ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: isRevenue ? '#10B981' : '#6366F1',
          pointBorderColor: '#1F2937',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
                const value = context.parsed.y;
                return isRevenue
                  ? `Revenue: $${value.toLocaleString()}`
                  : `Orders: ${value.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: '#374151',
            },
            ticks: {
              color: '#9CA3AF',
              font: {
                size: 12
              }
            }
          },
          y: {
            grid: {
              color: '#374151',
              // borderWidth: 0, // <-- fix here
            },
            ticks: {
              color: '#9CA3AF',
              font: {
                size: 12
              },
              callback: (value) => {
                return isRevenue
                  ? `$${Number(value).toLocaleString()}`
                  : Number(value).toLocaleString();
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart) return;

    const data = this.getChartData();
    this.chart.data.labels = data.map(d => d.label);
    this.chart.data.datasets[0].data = data.map(d => d.value);
    this.chart.update('active');
  }

  private getChartData(): ChartData[] {
    return this.type === 'revenue'
      ? this.orderService.getRevenueChartData(this.timeRange)
      : this.orderService.getOrderVolumeChartData(this.timeRange);
  }
}