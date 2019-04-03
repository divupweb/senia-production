import { Error404Component } from '../errors';
import { CompanyAreaComponent } from './company-area.component';

import { CompanyDashboardComponent } from './dashboard';
import {
  ReportAreaComponent,
  CustomReportComponent,
  CompanyReportComponent
} from './reports';
import {
  CompanySettingsComponent,
  AdminCompanySettingsComponent,
  AdminProfileEditComponent
} from './settings';
import { SuspendComponent } from '../helpers/suspend';
import {
  CompanyEmployeesComponent,
  KitchensComponent,
  EmployeeComponent
} from './employees';
import {
  GroupOrdersComponent,
  CompanyOrdersComponent,
  CompanyDefaultsComponent
} from './group-orders';

import { CanDeactivateGuard } from 'app/shared';

export const routes = [
  {
    path: '',
    component: CompanyAreaComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: CompanyDashboardComponent },
      {
        path: 'employees', component: CompanyEmployeesComponent,
        children: [
          { path: '', redirectTo: 'kitchens', pathMatch: 'full' },
          {
            path: 'kitchens',
            component: KitchensComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          { path: 'employee/:id', component: EmployeeComponent },
          { path: 'employee', component: EmployeeComponent },
        ]
      },
      {
        path: 'group-oders', component: GroupOrdersComponent,
        children: [
          { path: '', redirectTo: 'orders', pathMatch: 'full' },
          { path: 'orders', component: CompanyOrdersComponent },
          { path: 'defaults', component: CompanyDefaultsComponent }
        ]
      },
      {
        path: 'report', component: ReportAreaComponent,
        children: [
          { path: '', redirectTo: 'custom/lunch', pathMatch: 'full' },
          { path: 'custom', component: CustomReportComponent },
          { path: ':subscription', component: CompanyReportComponent },
        ]
      },
      {
        path: 'settings', component: CompanySettingsComponent,
        children: [
          { path: '', redirectTo: 'info', pathMatch: 'full' },
          { path: 'info', component: AdminCompanySettingsComponent },
          { path: 'suspend', component: SuspendComponent },
          { path: 'admin-profile', component: AdminProfileEditComponent }

        ]
      },
      { path: '**', component: Error404Component }
    ]
  }
];
