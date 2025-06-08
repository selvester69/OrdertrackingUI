import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Menu, X, Download, Package } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <header class="bg-gray-800 border-b border-gray-700 shadow-lg">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center">
          <button
            (click)="onSidebarToggle()"
            class="mr-3 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
          >
            <lucide-icon [img]="sidebarOpen ? XIcon : MenuIcon" size="20"></lucide-icon>
          </button>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-indigo-600 rounded-lg">
              <lucide-icon [img]="PackageIcon" size="24" class="text-white"></lucide-icon>
            </div>
            <div>
              <h1 class="text-xl font-bold text-white">Order Tracking</h1>
              <p class="text-sm text-gray-400">Dashboard</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex bg-gray-700 rounded-lg p-1">
            <button
              *ngFor="let range of timeRanges"
              (click)="onTimeRangeChange(range.value)"
              [class]="getTimeRangeButtonClass(range.value)"
            >
              {{ range.label }}
            </button>
          </div>
          
          <button class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm transition-colors duration-200 font-medium">
            <lucide-icon [img]="DownloadIcon" size="16"></lucide-icon>
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() sidebarOpen = true;
  @Input() timeRange: 'today' | '7d' | '30d' | '90d' | '1y' = '7d';
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() timeRangeChange = new EventEmitter<'today' | '7d' | '30d' | '90d' | '1y'>();

  readonly MenuIcon = Menu;
  readonly XIcon = X;
  readonly DownloadIcon = Download;
  readonly PackageIcon = Package;

  timeRanges = [
    { value: 'today' as const, label: 'Today' },
    { value: '7d' as const, label: '7d' },
    { value: '30d' as const, label: '30d' },
    { value: '90d' as const, label: '90d' },
    { value: '1y' as const, label: '1y' },
  ];

  onSidebarToggle(): void {
    this.sidebarToggle.emit();
  }

  onTimeRangeChange(range: 'today' | '7d' | '30d' | '90d' | '1y'): void {
    this.timeRangeChange.emit(range);
  }

  getTimeRangeButtonClass(range: string): string {
    const baseClass = 'px-3 py-1.5 text-sm rounded-md transition-colors duration-200 font-medium';
    return this.timeRange === range
      ? `${baseClass} bg-indigo-600 text-white`
      : `${baseClass} text-gray-300 hover:text-white hover:bg-gray-600`;
  }
}