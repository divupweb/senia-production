import { Component, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { ToastService } from "app/services";
import { UsersApiService } from '../users-api.service'
import { TranslateService } from "@ngx-translate/core";



@Component({
  providers: [ UsersApiService ],
  selector: 'users-list',
  styleUrls: ['users-list.scss'],
  templateUrl: 'users-list.html'
})

export class UsersListComponent implements OnInit {

  public paginationConfig: PaginationInstance = {
    id: 'users',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 1
  };

  constructor(protected service: UsersApiService,
              protected toastService: ToastService,
              protected translate: TranslateService) {}
  public users: any[];

  ngOnInit() {
    this.getUsersPage(1);
  }

  getUsersPage(page: number = this.paginationConfig.currentPage) {
    let paginationParams = {page: page, per_page: this.paginationConfig.itemsPerPage};
    this.service.index(paginationParams).subscribe(
      (response) => {
        this.paginationConfig.currentPage = page;
        this.paginationConfig.totalItems = response.total;
        this.users = response.items
      },
      (error) => this.toastService.error(error)
    )
  }

  removeUser(id) {
    this.service.remove(id).subscribe(
      (response) => this.getUsersPage(1),
      (error) => this.toastService.error(error)
    )
  }

  showConfirm(id) {
    if(confirm(this.translate.instant('LOGISTICS.DELETE_CONFIRMATION'))) {
      this.removeUser(id);
    }
  };
}
