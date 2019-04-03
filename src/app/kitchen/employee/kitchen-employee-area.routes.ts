import { Error404Component } from 'app/errors';
import { KitchenEmployeeAreaComponent } from './kitchen-employee-area.component';
import { MenuModule } from '../admin/menu';
import { KitchenDashboardComponent } from '../admin/dashboard/dashboard.component'

export const routes = [
  {
    path: '',
    component: KitchenEmployeeAreaComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: KitchenDashboardComponent },
      ...MenuModule.routes,
      { path: '**', component: Error404Component }
    ]
  }
];
