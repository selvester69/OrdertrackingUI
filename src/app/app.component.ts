import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    HeaderComponent, 
    SidebarComponent, 
    DashboardComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <app-header 
        [sidebarOpen]="sidebarOpen" 
        (sidebarToggle)="toggleSidebar()"
        [timeRange]="timeRange"
        (timeRangeChange)="onTimeRangeChange($event)">
      </app-header>
      
      <div class="flex flex-1 overflow-hidden">
        <app-sidebar [open]="sidebarOpen"></app-sidebar>
        
        <main class="flex-1 overflow-auto p-4 transition-all duration-300">
          <app-dashboard [timeRange]="timeRange"></app-dashboard>
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sidebarOpen = true;
  timeRange: 'today' | '7d' | '30d' | '90d' | '1y' = '7d';

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onTimeRangeChange(range: 'today' | '7d' | '30d' | '90d' | '1y'): void {
    this.timeRange = range;
  }
}