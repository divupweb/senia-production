import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './kitchen-area.routes';
import { ErrorsModule } from "../../errors"
import {
  UserMenuService,
  SharedModule,
  SharedKitchenAdminModule,
  UserMenuModule, AppCommonModule
} from '../../shared';

import {
  KitchenSettingsApiService,
  KitchenSubscriptionsApiService,
  KitchenLogoChangedService,
  KitchenSettings
} from "../services/";


// components
import { KitchenAreaComponent } from "./kitchen-area.component";
import { ReportsModule } from "./reports/";
import { SettingsModule } from './settings';
import { KitchenDashboardModule } from './dashboard';
import { MenuModule } from './menu';
import { LogisticsDashboardModule, LogisticsLocationsModule } from '../../logistics';
import {SharedComponentsModule} from "app/helpers";

@NgModule({
  imports: [
    AppCommonModule,
    ErrorsModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
    SharedKitchenAdminModule.forRoot(),
    UserMenuModule.forRoot(),
    ReportsModule.forRoot(),
    UserMenuModule.forRoot(),
    KitchenDashboardModule.forRoot(),
    MenuModule.forRoot(),
    SettingsModule.forRoot(),
    LogisticsDashboardModule,
    LogisticsLocationsModule,
  ],
  declarations: [
    KitchenAreaComponent,
  ]
})
export class KitchenAreaModule {}
