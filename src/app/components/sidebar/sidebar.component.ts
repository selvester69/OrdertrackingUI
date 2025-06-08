import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LayoutDashboard, Package, Truck, BarChart3, Users, Settings, Bell, LogOut, TrendingUp } from 'lucide-angular';

interface MenuItem {
  icon: any;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <aside [class]="getSidebarClass()">
      <div class="py-4 flex flex-col h-full">
        <div class="flex-1">
          <button
            *ngFor="let item of menuItems"
            [class]="getMenuItemClass(item)"
          >
            <lucide-icon [img]="item.icon" size="20"></lucide-icon>
            <span *ngIf="open" class="transition-opacity duration-200">{{ item.label }}</span>
          </button>
        </div>
        
        <div class="border-t border-gray-700 pt-4">
          <button [class]="getMenuItemClass({ icon: LogOutIcon, label: 'Log out' })">
            <lucide-icon [img]="LogOutIcon" size="20"></lucide-icon>
            <span *ngIf="open" class="transition-opacity duration-200">Log out</span>
          </button>
        </div>
      </div>
    </aside>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() open = true;

  readonly LogOutIcon = LogOut;

  menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Package, label: 'Orders' },
    { icon: Truck, label: 'Shipping' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: TrendingUp, label: 'Reports' },
    { icon: Users, label: 'Customers' },
    { icon: Bell, label: 'Notifications' },
    { icon: Settings, label: 'Settings' },
  ];

  getSidebarClass(): string {
    const baseClass = 'bg-gray-800 border-r border-gray-700 transition-all duration-300 flex-shrink-0';
    return this.open ? `${baseClass} w-64` : `${baseClass} w-16`;
  }

  getMenuItemClass(item: MenuItem): string {
    const baseClass = 'w-full flex items-center transition-colors duration-200 text-left';
    const spacingClass = this.open ? 'px-4 py-3 gap-3' : 'px-3 py-3 justify-center';
    const activeClass = item.active 
      ? 'text-white bg-gray-700 border-r-2 border-indigo-500' 
      : 'text-gray-400 hover:text-white hover:bg-gray-700';
    
    return `${baseClass} ${spacingClass} ${activeClass}`;
  }
}