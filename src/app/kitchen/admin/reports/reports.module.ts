import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserMenuModule, SharedModule } from '../../../shared';

import { routes } from './reports.routes'
import { KitchenReportComponent } from "./kitchen-report/kitchen-report.component";
import { CustomReportComponent, FiltersComponent } from "./custom-report/";
import { ReportAreaComponent } from "./report-area.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UserMenuModule,
    SharedModule,
  ],
  declarations: [
    ReportAreaComponent,
    KitchenReportComponent,
    CustomReportComponent,
    FiltersComponent
  ]
})
export class ReportsModule {
  static get routes() {
    return routes;
  }

  static forRoot() {
    return {
      ngModule: ReportsModule,
    };
  }
}
