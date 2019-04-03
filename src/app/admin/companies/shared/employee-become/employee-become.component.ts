import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AbstractPopupComponent } from "app/shared";
import { ToastService, AuthService, AppStateService } from "app/services";
import { AdminCompaniesService } from 'app/admin/services';


@Component({
  selector: 'employee-become',
  templateUrl: './employee-become.component.html',
  styleUrls: ['./employee-become.component.scss']
})
export class EmployeeBecomeComponent extends AbstractPopupComponent {
  id;
  employees;
  search;

  constructor(
    public toast: ToastService,
    public service: AdminCompaniesService,
    private router: Router,
    private auth: AuthService,
    private appState: AppStateService) { super() }

  open(id) {
    this.id = id;
    this.init();
    this.show();
  }

  private init() {
    this.employees = [];
    this.search = '';
    this.load()
  }

  private load() {
    this.service.getCompanyEmployees(this.id).subscribe(
      (response) => this.employees = response,
      (error) => this.toast.error(error)
    )
  }

  become(userId) {
    this.service.becomeEmployee(userId).subscribe(
      (data) => {
        this.appState.set('current', data.user);
        let link = this.auth.getLink();
        this.router.navigate(link);
      },
      (error) => {
        this.toast.error(error);
      }
    );
  }
}
