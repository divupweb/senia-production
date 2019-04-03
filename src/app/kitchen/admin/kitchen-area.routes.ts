import { Error404Component } from '../../errors';
import { KitchenAreaComponent } from './kitchen-area.component';
import { ReportsModule } from "./reports/";
import { SettingsModule } from "./settings/";
import { MenuModule } from './menu';
import { KitchenDashboardComponent } from './dashboard/dashboard.component'
import { LogisticsDashboardComponent } from '../../logistics/dashboard';
import { LogisticsLocationsComponent } from '../../logistics/locations';

export const routes = [
  {
    path: '',
    component: KitchenAreaComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: KitchenDashboardComponent },
      ...ReportsModule.routes,
      ...MenuModule.routes,
      ...SettingsModule.routes,
      { path: 'deliveries', component: LogisticsDashboardComponent},
      { path: 'deliveries/locations/:subscription/:date', component: LogisticsLocationsComponent },
      { path: '**', component: Error404Component }
    ]
  }
];
