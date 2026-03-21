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
          import('./pages/CEO/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'daily-input',
        loadComponent: () =>
          import('./pages/CEO/dailyinput/dailymetric/dailymetric.component').then(
            (m) => m.DailymetricComponent,
          ),
      },
      {
        path: 'calculator',
        loadComponent: () =>
          import('./pages/CEO/calculator/calculator.component').then(
            (m) => m.CalculatorComponent,
          ),
      },
      {
        path: 'invoice-tracker',
        loadComponent: () =>
          import('./pages/CEO/invoice/invoice.component').then(
            (m) => m.InvoiceComponent,
          ),
      },
      {
        path: 'settings/Locacions',
        loadComponent: () =>
          import('./pages/CEO/locations/location-pri/location-pri.component').then(
            (m) => m.LocationPriComponent,
          ),
      },
      {
        path: 'settings/Profile',
        loadComponent: () =>
          import('./pages/user/user-pri/user-pri.component').then(
            (m) => m.UserPriComponent,
          ),
      },
      {
        path: 'settings/Goals',
        loadComponent: () =>
          import('./pages/CEO/goals/goal-pri/goal-pri.component').then(
            (m) => m.GoalPriComponent,
          ),
      },

      //------ Recetas

      {
        path: 'Purchase',
        loadComponent: () =>
          import('./pages/receta/purchase/purchase-pri/purchase-pri.component').then(
            (m) => m.PurchasePriComponent,
          ),
      },
      {
        path: 'Stock',
        loadComponent: () =>
          import('./pages/receta/stock/stock-list/stock-list.component').then(
            (m) => m.StockListComponent,
          ),
      },
      {
        path: 'settings/insumos',
        loadComponent: () =>
          import('./pages/receta/insumos/insumos-pri/insumos-pri.component').then(
            (m) => m.InsumosPriComponent,
          ),
      },
      {
        path: 'settings/consersion',
        loadComponent: () =>
          import('./pages/receta/conversion/conversion-pri/conversion-pri.component').then(
            (m) => m.ConversionPriComponent,
          ),
      },
      {
        path: 'Recepy',
        loadComponent: () =>
          import('./pages/receta/recipe/recipe-pri/recipe-pri.component').then(
            (m) => m.RecipePriComponent,
          ),
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
