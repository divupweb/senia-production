import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SharedPipesModule } from 'app/pipes';
import { SharedComponentsModule} from "app/helpers";
import {
  DashboardComponent,
  DayItemComponent,
  PendingCarouselComponent,
  ReportPopupComponent,
  ManualOrdersComponent,
  OwnersGroupComponent
} from "./dashboard";
import { AppCommonModule, LineCalendarModule, SharedAdminModule, UserMenuModule} from "app/shared";
import { DashboardAreaComponent} from "./dashboard-area.component";
import { RouterModule} from "@angular/router";
import {
  AdminPendingKitchensComponent,
  KitchenNewComponent,
  KitchenUpdateComponent,
  KitchenUpdateSubscriptionComponent
} from "app/admin/dashboard/pending_kitchens";
import { AdminPendingCompaniesComponent} from "app/admin/dashboard/pending_companies";
import { AdminKitchensService, AdminKitchenUpdatesService} from "app/admin/services";
import { AdminCompaniesService } from "app/admin/services";
import { RegisterKitchenService } from 'app/shared/auth/kitchen-register';
import { PendingCompanyComponent} from "app/admin/dashboard/shared";
import { SwiperModule} from "angular2-useful-swiper";
import { components as notificationsComponents } from './notifications';


const routes = [
  { path: 'dashboard', component: DashboardAreaComponent,
    children: [
      { path: '', redirectTo: 'index', pathMatch: 'full' },
      { path: 'index', component: DashboardComponent, useAsDefault: true },
      { path: 'pending_kitchens', component:  AdminPendingKitchensComponent },
      { path: 'pending_companies', component: AdminPendingCompaniesComponent },
    ]
  }];

@NgModule({
  imports: [
    AppCommonModule,
    FormsModule,
    LineCalendarModule,
    RouterModule,
    SharedPipesModule.forRoot(),
    SharedComponentsModule.forRoot(),
    SharedAdminModule.forRoot(),
    SwiperModule,
    UserMenuModule.forRoot()
  ],
  declarations: [
    AdminPendingCompaniesComponent,
    AdminPendingKitchensComponent,
    DayItemComponent,
    DashboardAreaComponent,
    DashboardComponent,
    KitchenNewComponent,
    KitchenUpdateComponent,
    KitchenUpdateSubscriptionComponent,
    ManualOrdersComponent,
    OwnersGroupComponent,
    PendingCarouselComponent,
    PendingCompanyComponent,
    ReportPopupComponent,
    notificationsComponents
  ],
  providers: [AdminCompaniesService, AdminKitchensService, AdminKitchenUpdatesService, RegisterKitchenService]
})


export class AdminDashboardModule {
  static get routes() {
    return routes;
  }

  static forRoot() {
    return {
      ngModule: AdminDashboardModule
    };
  }
}
