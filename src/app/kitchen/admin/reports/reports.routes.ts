import { ReportAreaComponent } from "./report-area.component";
import { CustomReportComponent } from "./custom-report/report-custom.component";
import { KitchenReportComponent } from "./kitchen-report/kitchen-report.component";

export const routes = [ { path: 'reports', component: ReportAreaComponent,
  children: [
    { path: '', redirectTo: 'lunch', pathMatch: 'full' },
    { path: 'custom', component: CustomReportComponent },
    { path: ':subscription', component: KitchenReportComponent },
  ]
},];
