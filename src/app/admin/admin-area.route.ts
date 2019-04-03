import { Error404Component } from '../errors';
import { AdminAreaComponent } from './admin-area.component';
import {
  AdminKitchensComponent,
  AdminKitchensListComponent,
  AdminNewKitchensComponent,
  AdminEditKitchensComponent,
} from './kitchens';
import {
  AdminCompaniesComponent,
  AdminCompaniesListComponent,
  AdminEditCompanyComponent,
  AdminNewCompanyComponent,
} from "./companies";
import { SharedLocationsModule } from './shared_locations';
import { AdminFeedbacksComponent } from './feedbacks';
import { ReportsModule } from "./reports";
import { LogisticsDashboardComponent } from '../logistics/dashboard';
import { LogisticsLocationsComponent } from '../logistics/locations';
import { SuspendsModule } from './suspends';
import {AdminDashboardModule} from "app/admin/dashboard";
import {SettingsModule} from "app/admin/settings";

export const routes = [
  {
    path: '',
    component: AdminAreaComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      ...AdminDashboardModule.routes,
      ...SharedLocationsModule.routes,
      ...SettingsModule.routes,
      ...ReportsModule.routes,
      {
        path: 'kitchens', component: AdminKitchensComponent,
        children: [
          { path: '',  component: AdminKitchensListComponent },
          { path: 'new',  component: AdminNewKitchensComponent },
          { path: 'edit/:id',  component: AdminEditKitchensComponent },
        ]
      },
      {
        path: 'companies', component: AdminCompaniesComponent,
        children: [
          { path: '',  component: AdminCompaniesListComponent },
          { path: 'new',  component: AdminNewCompanyComponent },
          { path: 'edit/:id',  component: AdminEditCompanyComponent },
        ]
      },
      { path: 'logistics_schedule', component: LogisticsDashboardComponent},
      { path: 'logistics_schedule/locations/:subscription/:date', component: LogisticsLocationsComponent },
      { path: 'feedbacks', component: AdminFeedbacksComponent },
      { path: '**', component: Error404Component }
    ]
  }
];
