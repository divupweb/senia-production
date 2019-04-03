import { Component, ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { ToastService } from "../../../services";
import {SuperAdminRegionsService} from "app/super-admin/services";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'super-admin-regions-list',
  styleUrls: ['super-admin-regions-list.scss'],
  templateUrl:'./super-admin-regions-list.html'
})

export class SuperAdminRegionsListComponent {
  constructor(public service: SuperAdminRegionsService,
              public element: ElementRef,
              private _router: Router,
              private toastService: ToastService,
              private route: ActivatedRoute,
              protected translate: TranslateService
  ) {}

  public accounts = [];
  deliveryTypes = ['Bjorn Transport', 'Food Farm']
  public paginationConfig = {
    id: 'accounts',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 1
  };

  ngOnInit() {
    this.getPage(1)
  }

  getPage(page: number = this.paginationConfig.currentPage) {
    let paginationParams = {page: page, per_page: this.paginationConfig.itemsPerPage};
    this.service.getList(paginationParams)
      .subscribe(
        response => {
          this.paginationConfig.currentPage = page;
          this.paginationConfig.totalItems = response.total;
          this.accounts = response.items;
        }, error => {
          this.toastService.error(error);
        }
      )
  }

  removeAccount(id) {
    this.service.removeItem(id).subscribe(
      response => { this.getPage(1) },
      error => this.toastService.error(error)
    )
  }

  showEdit(id) {
    this._router.navigate([id], { relativeTo: this.route });
  }

  showConfirm(id) {
    if(confirm( this.translate.instant('SUPER_ADMIN.DELETE_REGION_CONF'))) {
      this.removeAccount(id);
    }
  };

  goToCreateForm() {
    this._router.navigate(['new'], { relativeTo: this.route });
  }
}
