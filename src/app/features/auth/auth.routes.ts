import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { LoginComponent } from './features/auth/login/login';

export const routes: Routes = [

  { path: '', component: LoginComponent },

  {
    path: 'app',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/home/home').then(m => m.HomeComponent),
      },
      {
        path: 'ventas',
        loadComponent: () =>
          import('./features/ventas/pages/pos/pos').then(m => m.PosComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '' }
];
