import {Component, ViewChild} from "@angular/core";
import {SlideInOut} from "app/shared/animations";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "app/services";
import {ReportApiService} from "./report-api.service";
import {FiltersComponent} from "./filter";
import * as SuperAdmin from "app/super-admin/reports/financial";

@Component({
  animations: [SlideInOut.animation],
  providers: [ReportApiService],
  selector: 'financial-report',
  styleUrls: ['financial-report.scss'],
  templateUrl: 'financial-report.html'
})

export class FinancialReportComponent extends SuperAdmin.FinancialReportComponent {

  public cardCharges: boolean = true;
  public kitchenInvoices: boolean = true;
  public companyInvoices: boolean = true;

  @ViewChild('filters')
  public filters: FiltersComponent|any;

  public constructor(protected api: ReportApiService,
                     protected translate: TranslateService,
                     protected toast: ToastService) {
    super(api, translate, toast)
  }

}
