import {Component, OnInit, ViewChild} from "@angular/core";
import {SlideInOut} from "app/shared/animations";
import {TranslateService} from "@ngx-translate/core";
import {ToastService, UrlOpenable} from "app/services";
import {ReportApiService} from "./report-api.service";
import {FiltersComponent} from "./filter";
import {Mixin} from "app/helpers";

@Component({
  animations: [SlideInOut.animation],
  providers: [ReportApiService],
  selector: 'financial-report',
  styleUrls: ['financial-report.scss'],
  templateUrl: 'financial-report.html'
})

@Mixin([UrlOpenable])
export class FinancialReportComponent implements OnInit {
  public openUrl: (url: string, focus?: boolean, tab?) => void;
  public openTab: () => void;
  public closeTabs: (t?) => void;

  public lastDay: any[] = [];
  public lastWeek: any[] = [];
  public lastMonth: any[] = [];

  public months: any[] = [];
  public cardCharges: boolean = false;
  public kitchenInvoices: boolean = false;
  public companyInvoices: boolean = false;
  public delivery: boolean = false;

  public report: any = {};
  public statistics: boolean = true;

  @ViewChild('filters')
  public filters: FiltersComponent;

  public constructor(protected api: ReportApiService,
                     protected translate: TranslateService,
                     protected toast: ToastService) {}

  public download(params: any): void {
    this.openTab();
    this.api.download(params).subscribe(
      (response) => this.openUrl(response.file.url, true),
      (error) => {
        this.toast.error(error);
        this.closeTabs();
      })
  }

  public generate(range): void {
    this.filters.setDate(range);
    this.submit(this.filters.toParams());
  }

  public submit(params: any): void {
    this.report = {};
    this.statistics = false;
    this.api.getDetail(params).subscribe((data) => this.report = data, (error) => this.toast.error(error));
  }

  public ngOnInit(): void {
    this.initDays();
    this.initMonths();
  }

  public showStatistics(): void {
    this.statistics = true;
    this.report = {};
  }

  public toggle(type): void {
    this[type] = !this[type];
  }

  protected initDays(): void {
    const now = moment();
    [this.lastDay, this.lastWeek, this.lastMonth] = ['day', 'week', 'month'].map((item: any) => {
      const clone = now.clone();
      const prev = clone.subtract(1, item);
      return [prev.clone().startOf(item), prev.clone().endOf(item)]
    });
  }

  protected initMonths(): void {
    const now = moment();
    this.months = _.times(3).map((i: number) =>
      now.clone().subtract(i + 1, 'month').startOf('month')).reverse();
  }

}
