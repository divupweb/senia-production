import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './logistics-area.route';
import { ErrorsModule } from "../errors"

import {
  UserMenuService,
  SharedModule,
  SharedLogisticsModule,
  UserMenuModule
 } from '../shared';

// components
import { LogisticsAreaComponent } from './logistics-area.component';
import {
  LogisticsDashboardMainComponent,
  LogisticsDashboardModule
} from './dashboard';
import { FailureLogisticsPopupModule } from './failure-popup';
import { LogisticsLocationsModule } from './locations';
import { LogisticsDetailsComponent } from './bank_details'

@NgModule({
  imports: [
    CommonModule,
    ErrorsModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
    UserMenuModule.forRoot(),
    SharedLogisticsModule,
    LogisticsDashboardModule,
    FailureLogisticsPopupModule,
    LogisticsLocationsModule,
  ],
  declarations: [
    LogisticsAreaComponent,
    LogisticsDashboardMainComponent,
    LogisticsDetailsComponent
  ],
  providers: [
    UserMenuService
  ]
})
export class LogisticsAreaModule {}
