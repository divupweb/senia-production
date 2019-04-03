import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './kitchen-employee-area.routes';
import { ErrorsModule } from "../../errors"
import {
  UserMenuService,
  SharedModule,
  SharedKitchenAdminModule,
  UserMenuModule
} from '../../shared';

import {
  KitchenSettingsApiService,
  KitchenSubscriptionsApiService,
  KitchenLogoChangedService,
  KitchenSettings
} from "../services/";


// components
import { KitchenEmployeeAreaComponent } from "./kitchen-employee-area.component";
import { KitchenDashboardModule } from '../admin/dashboard';
import { MenuModule } from '../admin/menu';

@NgModule({
  imports: [
    CommonModule,
    ErrorsModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
    SharedKitchenAdminModule.forRoot(),
    UserMenuModule.forRoot(),
    KitchenDashboardModule.forRoot(),
    MenuModule.forRoot(),
  ],
  declarations: [
    KitchenEmployeeAreaComponent,
  ]
})
export class KitchenEmployeeAreaModule {}
