import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {UserMenuModule, SharedModule, AppCommonModule, ChangePasswordModule} from '../../../shared';


import { routes } from './settings.routes'

import { SettingsAreaComponent } from './settings-area.component';
import { DeadlinesComponent, DeadlineFormComponent } from './deadlines/';
import { KitchenSettingsComponent } from './general/';
import { SuspendPlannerComponent } from './suspend-planner/';
import { KitchenUsersListComponent, UserFormComponent } from './users'
import { SharedKitchenAdminModule } from "../../../shared/";
import { DishDiscountComponent } from './discounts/';
import { TimePickerConfigProvider } from 'app/services';

@NgModule({
  imports: [
    AppCommonModule,
    ChangePasswordModule,
    RouterModule,
    UserMenuModule,
    SharedModule,
    SharedKitchenAdminModule,
  ],
  declarations: [
    SettingsAreaComponent,
    DeadlinesComponent,
    DeadlineFormComponent,
    KitchenSettingsComponent,
    SuspendPlannerComponent,
    KitchenUsersListComponent,
    UserFormComponent,
    DishDiscountComponent
  ]
})
export class SettingsModule {
  static get routes() {
    return routes;
  }

  static forRoot() {
    return {
      ngModule: SettingsModule,
      providers: [
        TimePickerConfigProvider
      ]
    };
  }
}
