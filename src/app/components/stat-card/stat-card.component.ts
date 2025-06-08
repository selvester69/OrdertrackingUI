import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Package, DollarSign, TrendingUp, Truck, ArrowUpRight, ArrowDownRight } from 'lucide-angular';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 card-hover">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-gray-400 font-medium text-sm uppercase tracking-wide">{{ title }}</h3>
        <div [class]="getIconContainerClass()">
          <lucide-icon [img]="getIcon()" size="20" class="text-white"></lucide-icon>
        </div>
      </div>
      
      <div class="flex flex-col">
        <p class="text-3xl font-bold text-white mb-2">{{ value }}</p>
        <div class="flex items-center">
          <span [class]="getChangeClass()">
            <lucide-icon [img]="isPositive ? ArrowUpRightIcon : ArrowDownRightIcon" size="16" class="mr-1"></lucide-icon>
            {{ abs(change) }}%
          </span>
          <span class="text-gray-500 text-sm ml-2">vs last period</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() change = 0;
  @Input() icon: 'package' | 'dollar-sign' | 'trending-up' | 'truck' = 'package';
  @Input() color: 'blue' | 'green' | 'purple' | 'orange' = 'blue';

  readonly PackageIcon = Package;
  readonly DollarSignIcon = DollarSign;
  readonly TrendingUpIcon = TrendingUp;
  readonly TruckIcon = Truck;
  readonly ArrowUpRightIcon = ArrowUpRight;
  readonly ArrowDownRightIcon = ArrowDownRight;

  get isPositive(): boolean {
    return this.change >= 0;
  }

  getIcon() {
    switch (this.icon) {
      case 'package': return this.PackageIcon;
      case 'dollar-sign': return this.DollarSignIcon;
      case 'trending-up': return this.TrendingUpIcon;
      case 'truck': return this.TruckIcon;
      default: return this.PackageIcon;
    }
  }

  getIconContainerClass(): string {
    const baseClass = 'p-3 rounded-lg';
    switch (this.color) {
      case 'blue': return `${baseClass} bg-blue-600`;
      case 'green': return `${baseClass} bg-green-600`;
      case 'purple': return `${baseClass} bg-purple-600`;
      case 'orange': return `${baseClass} bg-orange-600`;
      default: return `${baseClass} bg-blue-600`;
    }
  }

  getChangeClass(): string {
    const baseClass = 'flex items-center text-sm font-medium';
    return this.isPositive 
      ? `${baseClass} text-green-400`
      : `${baseClass} text-red-400`;
  }

  abs(value: number): number {
    return Math.abs(value);
  }
}