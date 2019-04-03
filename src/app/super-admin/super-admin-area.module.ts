import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginationModule } from 'ng2-bootstrap';

import { routes } from './super-admin-area.route';
import {
  UserMenuModule,
  SharedModule,
  SharedSuperAdminModule
} from '../shared';

import { SuperAdminAreaComponent } from "./super-admin-area.component"
import { SuperAdminDashboardComponent } from "./dashboard"
import { ProspectiveAccounsComponent } from "./prospective-accounts";
import {
  SuperAdminRegionsComponent,
  SuperAdminRegionsListComponent,
  SuperAdminNewRegionComponent,
  SuperAdminEditRegionComponent
} from "./regions";

import {
  IngredientsComponent,
  AllergiesPopupComponent
} from './ingredients';
import {
  AdminAllergiesComponent,
  AdminAllergiesListComponent,
  AdminNewAllergyComponent,
  AdminEditAllergyComponent
} from "./allergies";
import { ErrorsModule } from "../errors"
import { ReportsModule } from "./reports";


@NgModule({
  bootstrap: [],
  declarations: [
    SuperAdminAreaComponent,
    SuperAdminDashboardComponent,
    ProspectiveAccounsComponent,
    AdminAllergiesComponent,
    AdminAllergiesListComponent,
    AdminNewAllergyComponent,
    AdminEditAllergyComponent,
    IngredientsComponent,
    AllergiesPopupComponent,
    SuperAdminRegionsComponent,
    SuperAdminRegionsListComponent,
    SuperAdminNewRegionComponent,
    SuperAdminEditRegionComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    UserMenuModule.forRoot(),
    ReportsModule.forRoot(),
    ErrorsModule,
    SharedSuperAdminModule.forRoot(),
    SharedModule.forRoot(),
  ],
  providers: [  ]
})

export class SuperAdminModule {}
