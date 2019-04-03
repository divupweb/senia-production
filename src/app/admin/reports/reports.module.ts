import {NgModule} from "@angular/core";
import {AdminReportsComponent} from "./reports.component";
import {AppCommonModule, SharedAdminModule, SharedModule, UserMenuModule} from "app/shared";
import {ReactiveFormsModule} from "@angular/forms";
import {CompanyOrdersComponent} from "./company_orders";
import {KitchenOrdersComponent} from "./kitchen_orders";
import {FinancialReportComponent, FiltersComponent, MonthTileComponent} from "./financial";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    AdminReportsComponent,
    CompanyOrdersComponent,
    FinancialReportComponent,
    FiltersComponent,
    KitchenOrdersComponent,
    MonthTileComponent
  ],
  imports: [
    AppCommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedAdminModule,
    SharedModule,
    UserMenuModule
  ],
  providers: [],
})

export class ReportsModule {
  static get routes() {
    return [{
      path: 'reports', component: AdminReportsComponent,
      children: [
        { path: 'company_orders', component: CompanyOrdersComponent },
        { path: 'kitchen_orders', component: KitchenOrdersComponent },
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
