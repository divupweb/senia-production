import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CompanySubscriptionsApiService } from '../shared'
import { ToastService, WindowWidth } from "app/services";
import {
  EmployeesProxyService,
  SubscriptionsProxyService
} from "app/company/employees/shared/proxies";
import { EmployeesApiService } from "app/company/employees/shared/api-services";

@Component({
  selector: 'report-area',
  providers: [
    CompanySubscriptionsApiService,
    EmployeesProxyService,
    SubscriptionsProxyService,
    EmployeesApiService,
    WindowWidth
  ],
  templateUrl: './report-area.html'
})


export class ReportAreaComponent {
  public subscriptions: any[];
  public selectedLink;
  constructor(private subscriptionsService: CompanySubscriptionsApiService,
              private toastService: ToastService,
              public width: WindowWidth,
              private router: Router,
              private route: ActivatedRoute) {
    this.router.navigate(['lunch'], { relativeTo: this.route });
    this.subscriptionsService.getList().subscribe(
      (subscriptions) => {
        this.subscriptions = _(subscriptions).filter((o) => o.active && 'catering' != o.subscription_type)
          .map((item) => item['subscription_type']).value();
        this.selectedLink = this.subscriptions[0];
      },
      (error) => {
        this.toastService.error(error);
      }
    );
  }
  goTo(link) {
    this.selectedLink = link.toLowerCase();
    this.router.navigate([link.toLowerCase()], { relativeTo: this.route });
  }
}
