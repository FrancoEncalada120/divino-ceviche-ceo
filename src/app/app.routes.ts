import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ShellComponent } from './layout/shell/shell.component';
import { authGuardGuard } from './core/Guard/auth-guard.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'CEO',
    component: ShellComponent,
    canActivate: [authGuardGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'daily-input',
        loadComponent: () =>
          import('./pages/dailyinput/dailymetric/dailymetric.component').then(
            (m) => m.DailymetricComponent
          ),
      },
      {
        path: 'calculator',
        loadComponent: () =>
          import('./pages/calculator/calculator.component').then(
            (m) => m.CalculatorComponent
          ),
      },
      {
        path: 'invoice-tracker',
        loadComponent: () =>
          import('./pages/invoice/invoice.component').then(
            (m) => m.InvoiceComponent
          ),
      },
      {
        path: 'settings/Locacions',
        loadComponent: () =>
          import('./pages/locations/location-pri/location-pri.component').then(
            (m) => m.LocationPriComponent
          ),
      },
      {
        path: 'settings/Goals',
        loadComponent: () =>
          import('./pages/goals/goal-pri/goal-pri.component').then(
            (m) => m.GoalPriComponent
          ),
      },

      //------

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
