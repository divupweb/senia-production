import { Component, ViewChild } from '@angular/core';
import { FiltersComponent } from "./filter";
import { UrlOpenable, ToastService } from "app/services/";
import { Mixin } from "app/helpers/decorators/";
import { KitchenReportApiService } from "../shared/";
import { UserMenuService } from 'app/shared/components/user-menu';


@Component({
  selector: 'report-custom',
  styleUrls: ['./report-custom.scss'],
  templateUrl: './report-custom.html'
})

@Mixin([UrlOpenable])
export class CustomReportComponent implements UrlOpenable {
  openUrl: (url: string, focus?: boolean, tab?) => void;  getTab: () => void;  openTab: () => void; closeTabs: (t?) => void;
  tab;


  @ViewChild('filters')
  public filters: FiltersComponent;
  public grouping: string;
  public isLoading: boolean = false;
  protected report: any;

  protected employees: any[];
  public constructor(private service: KitchenReportApiService,
                     public userMenu: UserMenuService,
                     private toast: ToastService) {}

  public submit(): void {
    const params = this.filters.toParams();
    this.grouping = params.grouping.join('_');
    this.report = [];
    this.isLoading = true;
    this.service.getCustomReport(params)
      .finally(() => this.isLoading = false)
      .subscribe((data: { report_data: any }) => this.report = data.report_data,
        (error) => this.toast.error(error));
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

}
