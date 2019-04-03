import { Component, ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { ToastService } from "../../../services";
import { AdminAllergiesService } from '../services';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'allergies-list',
  providers: [ AdminAllergiesService ],
  styleUrls: [ 'allergies-list.scss'],
  templateUrl: './allergies-list.html'
})

export class AdminAllergiesListComponent {
  constructor(public service: AdminAllergiesService,
              public element: ElementRef,
              private router: Router,
              private toastService: ToastService,
              private route: ActivatedRoute,
              protected translate: TranslateService
            ) {}

  public allergies = [];
  public paginationConfig = {
    id: 'allergies',
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
          this.allergies = response.items;
        }, error => {
          this.toastService.error(error);
        }
      )
  }

  removeAllergy(id) {
    this.service.removeItem(id).subscribe(
      response => { this.getPage(1) },
      error => { this.toastService.error(error) }
    )
  }

  showEdit(id) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  showConfirm(id) {
    if(confirm(this.translate.instant('SUPER_ADMIN.DELETE_ALLERGY_CONF'))) {
      this.removeAllergy(id);
    }
  };
}
