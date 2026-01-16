import { Component } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { MenuItem } from './menu.model';
import { filter } from 'rxjs';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    RouterLink,
    RouterLinkActive,
    NgClass,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  items: MenuItem[] = [
    { type: 'section', label: 'OPERATIONS' },
    { type: 'link', label: 'Dashboard', icon: 'bi-grid', route: 'dashboard' },
    {
      type: 'link',
      label: 'Daily Input',
      icon: 'bi-plus-circle',
      route: 'daily-input',
    },
    // {
    //   type: 'link',
    //   label: 'Monthly P&L',
    //   icon: 'bi-calendar',
    //   route: 'monthly-pl',
    // },
    {
      type: 'link',
      label: 'Profit Calculator',
      icon: 'bi-calculator',
      route: 'calculator',
    },
    {
      type: 'link',
      label: 'Invoice Tracker',
      icon: 'bi-receipt',
      route: 'invoice-tracker',
    },
    {
      type: 'group',
      label: 'Settings',
      icon: 'bi-gear',
      isOpen: false,
      children: [
        {
          type: 'link',
          label: 'Profile',
          icon: 'bi-person',
          route: 'settings/Profile',
        },
        {
          type: 'link',
          label: 'Locations',
          icon: 'bi-building',
          route: 'settings/Locacions',
        },
        {
          type: 'link',
          label: 'Goals',
          icon: 'bi-building',
          route: 'settings/Goals',
        },
      ],
    },
  ];

  constructor(private router: Router) {
    // Auto-abre el group Settings si estás dentro de /settings/...
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.syncOpenGroups());
    this.syncOpenGroups();
  }

  toggleGroup(item: MenuItem) {
    if (item.type !== 'group') return;
    item.isOpen = !item.isOpen;
  }

  private syncOpenGroups() {
    const url = this.router.url;
    for (const item of this.items) {
      if (item.type === 'group') {
        item.isOpen = item.children.some((c) => url.startsWith(c.route));
      }
    }
  }
}
