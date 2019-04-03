import { Component } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { AdminFeedbacksService } from "../feedbacks/admin-feedbacks.service";
import { ToastService } from "../../services";
import {AdminPendingService} from "app/admin/services";

@Component({
  selector: 'feedbacks',
  providers: [ AdminFeedbacksService ],
  styleUrls: [ 'feedbacks.scss' ],
  templateUrl: './feedbacks.html'
})

export class AdminFeedbacksComponent {
  constructor(public service: AdminFeedbacksService,
              private toastService: ToastService,
              public pendingService: AdminPendingService) {}

  public feedbacks = [];

  public paginationConfig: PaginationInstance = {
    id: 'feedbacks',
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
        (response) => {
          this.paginationConfig.currentPage = page;
          this.paginationConfig.totalItems = response.total;
          this.feedbacks = response.items;
          this.seenUpdate();
        },
        (error) => {
          this.toastService.error(error);
        }
      )
  }

  private seenUpdate() {
    let ids = _.map(_.filter(this.feedbacks, { is_read: false }), 'id');
    if (ids.length > 0) {
      setTimeout(() => {
        this.service.updateSeen(ids).subscribe(
          (count) => {
            _.each(ids, (id) => _.find(this.feedbacks, {id: id}).is_read = true);
            this.pendingService.count.feedback = count;
          },
          (error) => this.toastService.error(error)
        )
      }, 2000)
    }
  }
}
