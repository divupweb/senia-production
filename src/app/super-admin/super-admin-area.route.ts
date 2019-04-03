import { SuperAdminAreaComponent } from "./super-admin-area.component"
import { SuperAdminDashboardComponent } from "./dashboard"
import {
  SuperAdminRegionsComponent,
  SuperAdminRegionsListComponent,
  SuperAdminNewRegionComponent,
  SuperAdminEditRegionComponent
} from "./regions";
import { IngredientsComponent } from './ingredients';
import {
  AdminAllergiesComponent,
  AdminAllergiesListComponent,
  AdminNewAllergyComponent,
  AdminEditAllergyComponent
} from "./allergies";
import { ProspectiveAccounsComponent } from "./prospective-accounts";
import { ReportsModule } from "./reports";
import { Error404Component } from '../errors';

export const routes = [
  {
    path: '',
    component: SuperAdminAreaComponent,
    children: [
      { path: '', component: SuperAdminDashboardComponent },
      ...ReportsModule.routes,
      { path: 'regions', component: SuperAdminRegionsComponent,
        children: [
          { path: '',  component: SuperAdminRegionsListComponent },
          { path: 'new',  component: SuperAdminNewRegionComponent },
          { path: ':id',  component: SuperAdminEditRegionComponent },
        ]
      },
      { path: 'ingredients', component: IngredientsComponent },
      {
        path: 'allergies', component: AdminAllergiesComponent,
        children: [
          { path: '', component: AdminAllergiesListComponent },
          { path: 'new', component: AdminNewAllergyComponent },
          { path: ':id', component: AdminEditAllergyComponent }
        ]
      },
      { path: 'prospective-accounts', component: ProspectiveAccounsComponent },
      { path: '**', component: Error404Component }
    ]
  }
];
