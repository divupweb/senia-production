import { Component } from '@angular/core';
import {
  EmployeesProxyService,
  SubscriptionsProxyService,
  SubsidiesProxyService
} from "./shared/proxies";
import { CompanySubscriptionsApiService } from "../shared/company-subscriptions-api.service";
import {
  EmployeesApiService,
  SubsidyApiService
} from "./shared/api-services";
import { UserMenuService } from 'app/shared/components/user-menu';

@Component({
  selector: 'company-employees',
  providers: [
    EmployeesProxyService,
    EmployeesApiService,
    SubsidyApiService,
    CompanySubscriptionsApiService,
    SubscriptionsProxyService,
    SubsidiesProxyService,
  ],
  styleUrls: ['employees.scss'],
  templateUrl: './employees.html'
})


export class CompanyEmployeesComponent {
  employees = [];

  constructor(public employeeProxy: EmployeesProxyService,
              public userMenu: UserMenuService) { }

  ngOnInit() {
    this.loadEmployees();
  }

  private loadEmployees() {
    this.employeeProxy.loaded$.subscribe(() => {
      this.employees = _.clone(this.employeeProxy.employees);
    })
  }
}
