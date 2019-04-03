import {NgModule} from "@angular/core";
import {AdminReportsComponent} from "./reports.component";
import {AppCommonModule, SharedAdminModule, SharedModule, UserMenuModule} from "app/shared";
import {ReactiveFormsModule} from "@angular/forms";
import { FinancialReportComponent, FiltersComponent } from "./financial";
import {RouterModule} from "@angular/router";
import {SuperAdminRegionsService} from "app/super-admin/services";

@NgModule({
  declarations: [
    AdminReportsComponent,
    FinancialReportComponent,
    FiltersComponent,
  ],
  imports: [
    AppCommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedAdminModule,
    SharedModule,
    UserMenuModule
  ],
  providers: [SuperAdminRegionsService],
})

export class ReportsModule {
  static get routes() {
    return [{
      path: 'reports', component: AdminReportsComponent,
      children: [
        { path: '', redirectTo: 'financial', pathMatch: 'full'},
        { path: 'financial', component: FinancialReportComponent }
      ]
    }];
  }

  static forRoot() {
    return {
      ngModule: ReportsModule,
    };
  }
}
