import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './driver-area.route';
import { ErrorsModule } from "../errors"

import {
  UserMenuService,
  SharedModule,
  UserMenuModule,
  SharedLogisticsModule
 } from '../shared';

// components
import { DriverAreaComponent } from './driver-area.component';
import { DriverDashboardComponent } from './driver';


@NgModule({
  imports: [
    CommonModule,
    ErrorsModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
    UserMenuModule.forRoot(),
    SharedLogisticsModule
  ],
  declarations: [
    DriverAreaComponent,
    DriverDashboardComponent
  ],
  providers: [
    UserMenuService
  ]
})
export class DriverAreaModule { }
