import { Routes } from '@angular/router';
import { Error404Component } from './errors';
import {
  UserAreaGuard,
  UserWizardGuard,
  CompanyAreaGuard,
  KitchenAreaGuard,
  LocalAdminAreaGuard,
  KitchenEmployeeAreaGuard,
  SuperAdminAreaGuard,
  LogisticsAreaGuard,
  DriverAreaGuard
} from './shared';

export const ROUTES: Routes = [
  { path: 'region', loadChildren: './enterprise-region#EnterpriseRegionModule' },
  { path: '', redirectTo: '/home/for-companies', pathMatch: 'full' },
  { path: 'home', loadChildren: './home#HomeModule' },
  { path: 'employee_confirmation/:employeeToken', loadChildren: './employee-confirmation#EmployeeConfirmationModule' },
  { path: 'user', loadChildren: './user#UserAreaModule', canActivate: [UserAreaGuard] },
  { path: 'sign-up-wizard', loadChildren: './sign-up-wizard#SignUpWizardModule', canActivate: [UserWizardGuard] },
  { path: 'company', loadChildren: './company#CompanyAreaModule', canActivate: [CompanyAreaGuard]},
  { path: 'fake-company', loadChildren: './company#CompanyAreaModule', canActivate: [CompanyAreaGuard] },
  { path: 'admin', loadChildren: './admin#AdminAreaModule', canActivate: [LocalAdminAreaGuard] },
  { path: 'kitchen', loadChildren: './kitchen/admin#KitchenAreaModule', canActivate: [KitchenAreaGuard] },
  { path: 'fake-kitchen', loadChildren: './kitchen/admin#KitchenAreaModule', canActivate: [KitchenAreaGuard] },
  { path: 'employee/kitchen', loadChildren: './kitchen/employee#KitchenEmployeeAreaModule', canActivate: [KitchenEmployeeAreaGuard] },
  { path: 'logistics/kitchen', loadChildren: './logistics#LogisticsAreaModule', canActivate: [LogisticsAreaGuard] },
  { path: 'logistics', loadChildren: './logistics#LogisticsAreaModule', canActivate: [LogisticsAreaGuard] },
  { path: 'driver/kitchen', loadChildren: './logistics#DriverAreaModule', canActivate: [DriverAreaGuard] },
  { path: 'driver', loadChildren: './logistics#DriverAreaModule', canActivate: [DriverAreaGuard] },

  { path: 'super', loadChildren: './super-admin#SuperAdminModule', canActivate: [SuperAdminAreaGuard] },

  { path: '**', component: Error404Component }
];
