import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ShellComponent } from './layout/shell/shell.component';
import { LocationPriComponent } from './pages/locations/location-pri/location-pri.component';

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
            './pages/locations/location-pri/location-pri.component'
          ).then((m) => m.LocationPriComponent),
      },
      {
        path: 'settings/Goals',
        loadComponent: () =>
          import(
            './pages/goals/goal-pri/goal-pri.component'
          ).then((m) => m.GoalPriComponent),
      },

      //------

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'dashboard' },
];
