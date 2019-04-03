import { Component } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { ToastService, AccountsApiService } from "app/services";
import {AdminPendingService} from "app/admin/services";
import { AdminCompaniesService } from "app/admin/services";


@Component({
  selector: 'pending-companies',
  providers: [ AdminCompaniesService, AccountsApiService ],
  styleUrls: [ 'pending-companies.scss' ],
  templateUrl: './pending-companies.html'
})


export class AdminPendingCompaniesComponent {
  constructor(public service: AdminCompaniesService,
              private toastService: ToastService,
              public pendingService: AdminPendingService,
              private accounts: AccountsApiService) {}

  public companies = [];
  public regions = [];

  public paginationConfig: PaginationInstance = {
    id: 'companies',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 1
  };

  ngOnInit() {
    this.getPage(1);
    this.loadRegions();
  }

  getPage(page: number = this.paginationConfig.currentPage) {
    let paginationParams = {page: page, per_page: this.paginationConfig.itemsPerPage};

    this.service.getPendingList(paginationParams)
      .subscribe(
        (response) => {
          this.paginationConfig.currentPage = page;
          this.paginationConfig.totalItems = response.total;
          this.companies = response.items;
          this.pendingService.count.companies = response.total;
        },
        (error) => {
          this.toastService.error(error);
        }
      )
  }

  approveCompany(id) {
    let approvedCompany = _.find(this.companies, { id });
    this.pendingService.count.total_companies++;
    approvedCompany.active = true;
    this.getPage(1);
  }

  rejectCompany(id) {
    _.remove(this.companies, { id });
    this.getPage(1);
  }

  private loadRegions() {
    this.accounts.withoutCurrent().subscribe(
      (data) => this.regions = data,
      (error) => this.toastService.error(error)
    )
  }
}
