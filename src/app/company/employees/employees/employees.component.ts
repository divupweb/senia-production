import { Component, Input, Inject } from '@angular/core';
import { EmployeesProxyService } from "app/company/employees/shared/proxies";
import { AppStateService, ToastService } from "app/services";
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'employees',
  styleUrls: ['employees.scss'],
  templateUrl: './employees.html'
})
export class EmployeesComponent {
  public search = '';
  public searchColumns = ['name', 'email'];
  public currentUser = {};
  public currentCompany: any = {};
  public inviteLink: string;
  @Input()
  public employees = [];

  constructor(public state: AppStateService,
              private employeeProxy: EmployeesProxyService,
              private toast: ToastService,
              private router: Router,
              @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    this.currentUser = this.state.currentUser();
    this.currentCompany = this.state.currentCompany();
    this.setEmployees();
    this.inviteLink = this.generateInviteLink();
  }

  ngOnChanges(changes) {
    if (changes['employees']) this.setEmployees();
  }

  changeActive(employee): void {
    if (employee.company_admin) return;
    setTimeout(
      this.employeeProxy.setActive(employee.id, employee.active).subscribe(() => true,
        (error) => this.toast.error('Could not change employee state')), 100);
  }

  generateInviteLink(): string {
    return encodeURIComponent(this.document.location.origin + this.router.createUrlTree(['/home/sign-up'], {
        queryParams: { pin: _.get(this.currentCompany, 'pin_code') }
      }));
  }

  private setEmployees() {
    if (!this.employees || this.employees.length == 0) return;
    let userId = this.currentUser['id'];
    this.employees.some((e) => e.you = e.id == userId);
    this.employees = _.sortBy(this.employees, [ (e)=> !e.you, 'name']);
  }
}
