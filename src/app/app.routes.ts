import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: ShellComponent,
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
          import('./pages/daily-input/daily-input.component').then(
            (m) => m.DailyInputComponent
          ),
      },
      {
        path: 'settings/Locacions',
        loadComponent: () =>
          import(
            './pages/locations/locations-list/locations-list.component'
          ).then((m) => m.LocationsListComponent),
      },

      //------

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'dashboard' },
];
