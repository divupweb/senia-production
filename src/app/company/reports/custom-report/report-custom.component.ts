import { Component, ViewChild } from '@angular/core';
import { FiltersComponent } from "./filter";
import { CompanyReportApiService } from "../company-report";
import { UrlOpenable, ToastService } from "app/services";
import { UserMenuService } from 'app/shared/components/user-menu';
import { Mixin } from "app/helpers";


@Component({
  selector: 'report-custom',
  providers: [ CompanyReportApiService ],
  styleUrls: ['report-custom.scss'],
  templateUrl: './report-custom.html'
})

@Mixin([UrlOpenable])
export class CustomReportComponent implements UrlOpenable {
  openUrl: (url: string, focus?: boolean, tab?) => void; getTab: () => void;  openTab: () => void; closeTabs: (t?) => void;
  tab;


  @ViewChild('filters')
  public filters: FiltersComponent;
  public grouping: string;
  public isLoading: boolean = false;
  public report: any[];
  public total: any;

  protected employees: any[];
  public constructor(private service: CompanyReportApiService,
                     public userMenu: UserMenuService,
                     private toast: ToastService) {}

  public submit(): void {
    const params = this.filters.toParams();
    this.grouping = params.grouping.join('_');
    this.report = [];
    this.total = null;
    this.isLoading = true;
    this.service.getCustomReport(params)
      .finally(() => this.isLoading = false)
      .subscribe((data: { total: any, details: any }) => {
        this.report = data.details;
        this.total = data.total;
        }, (error) => this.toast.error(error));
  }

  public download(): void {
    this.openTab();
    this.service.getCustomReportFile(this.filters.toParams())
      .subscribe(
        (response) => {
          this.openUrl(response.file.url, true);
        },
        (error) => {
          this.toast.error(error);
          this.closeTabs();
        }
      )
  }

  public isCompany(ownerType: string): boolean {
    return ownerType.toLowerCase() == 'company'
  }

}
