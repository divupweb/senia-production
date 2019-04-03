import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  SharedModule,
  SharedAdminModule,
  UserMenuModule,
  AppCommonModule,
  AddCategoryModule
} from 'app/shared';
import { ErrorsModule } from "app/errors"
import { routes } from './admin-area.route';

// components
import { AdminAreaComponent } from './admin-area.component';
import { AdminFeedbacksComponent } from './feedbacks';

import {
  AdminCompaniesComponent,
  AdminCompaniesListComponent,
  AdminEditCompanyComponent,
  AdminNewCompanyComponent,
  CompanyKitchensComponent,
  CompanyDiscountComponent,
  CompanyCreditsComponent,
  SortMarkComponent,
  KitchensSelectListComponent,
  EmployeeBecomeComponent,
  SharedLocationComponent,
  CompanyInfoComponent
} from "./companies";

import {
  AdminKitchensComponent,
  AdminKitchensListComponent,
  AdminNewKitchensComponent,
  AdminEditKitchensComponent,
  SubscriptionComponent,
  KitchenInterestDiscountComponent,
  AdminKitchenCategoriesListComponent
} from './kitchens';


import { SharedLocationsModule } from './shared_locations';
import { LogisticsDashboardModule, LogisticsLocationsModule } from 'app/logistics';
import { MonthSelectModule } from 'app/shared/month-select.module'
import {AdminDashboardModule} from "app/admin/dashboard";
import {SettingsModule} from "app/admin/settings";
import { providers } from './admin-area.providers';
import {ReportsModule} from "app/admin/reports";
import { SortComponent, GenerateInvoiceModule } from './shared';

@NgModule({
  imports: [
    AppCommonModule,
    ErrorsModule,
    RouterModule.forChild(routes),
    AdminDashboardModule.forRoot(),
    SharedModule.forRoot(),
    SharedAdminModule.forRoot(),
    UserMenuModule.forRoot(),
    LogisticsDashboardModule,
    LogisticsLocationsModule,
    ReportsModule.forRoot(),
    SharedLocationsModule,
    SettingsModule.forRoot(),
    MonthSelectModule,
    AddCategoryModule,
    GenerateInvoiceModule
  ],
  declarations: [
    AdminAreaComponent,
    AdminKitchenCategoriesListComponent,
    AdminFeedbacksComponent,
    AdminCompaniesComponent,
    AdminCompaniesListComponent,
    AdminEditCompanyComponent,
    AdminNewCompanyComponent,
    SharedLocationComponent,
    CompanyKitchensComponent,
    KitchensSelectListComponent,
    AdminKitchensComponent,
    AdminKitchensListComponent,
    AdminNewKitchensComponent,
    AdminEditKitchensComponent,
    SubscriptionComponent,
    CompanyDiscountComponent,
    CompanyCreditsComponent,
    KitchenInterestDiscountComponent,
    SortMarkComponent,
    SortComponent,
    EmployeeBecomeComponent,
    CompanyInfoComponent
  ],
  providers: [
    providers
  ]
})
export class AdminAreaModule { }
