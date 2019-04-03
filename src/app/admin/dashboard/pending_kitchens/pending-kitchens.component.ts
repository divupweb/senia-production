import { Component, ViewEncapsulation } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { ToastService } from "app/services";
import { AdminKitchensService, AdminKitchenUpdatesService, AdminPendingService } from "app/admin/services";

@Component({
  selector: 'pending-kitchens',
  providers: [ AdminKitchensService, AdminKitchenUpdatesService ],
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ 'pending-kitchens.scss' ],
  templateUrl: './pending-kitchens.html'
})


export class AdminPendingKitchensComponent {
  constructor(public service: AdminKitchensService,
              public pendingService: AdminPendingService,
              private toastService: ToastService
              ) {}

  kitchens = [];
  dishCategories: any[];
  paginationConfig: PaginationInstance = {
    id: 'kitchens',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 1
  };

  ngOnInit() {
    this.getPage(1)
  }

  getPage(page: number = this.paginationConfig.currentPage) {
    let paginationParams = {page: page, per_page: this.paginationConfig.itemsPerPage};

    this.service.getPendingList(paginationParams)
      .subscribe(
        (response) => {
          this.paginationConfig.currentPage = page;
          this.paginationConfig.totalItems = response.total;
          this.kitchens = response.items;
          this.pendingService.count.kitchens = response.total;
        },
        (error) => {
          this.toastService.error(error);
        }
      )
  }


  isUpdate(kitchen) {
    return !!kitchen.kitchen_update;
  }

  onApprove(kitchen, event) {
    this.pendingService.count.kitchens -= 1;
    this.pendingService.count.total_kitchens++;
    let approvedKitchen = _.find(this.kitchens, {id: kitchen.id});
    approvedKitchen.approved_at = kitchen.approved_at;
    this.getPage(1);
  }

  onReject(kitchen, event) {
    this.pendingService.count.kitchens -= 1;
    _.remove(this.kitchens, {id: kitchen.id});
    this.getPage(1);
  }

  onError(error, event) {
    this.toastService.error(error);
  }


}
