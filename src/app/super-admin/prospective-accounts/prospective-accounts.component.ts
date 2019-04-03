import { Component } from '@angular/core';
import { ToastService } from '../../services';
import { ProspectiveAccountsApiService } from './prospective-accounts-api.service';


@Component({
  selector: 'prospective-accounts',
  providers: [ProspectiveAccountsApiService],
  styleUrls:  ['prospective-accounts.scss'],
  templateUrl: './prospective-accounts.html'
})

export class ProspectiveAccounsComponent {
  items = [];
  public paginationConfig = {
    id: 'prospective-accounts',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 1
  };


  constructor(public service: ProspectiveAccountsApiService,
              private toast: ToastService) {}

  ngOnInit() {
    this.getPage();
  }

  private getPage(page = this.paginationConfig.currentPage) {
    let paginationParams = {page: page, per_page: this.paginationConfig.itemsPerPage};

    this.service.index(paginationParams).subscribe(
      response => {
        this.paginationConfig.currentPage = response.page;
        this.paginationConfig.totalItems = response.total;
        this.items = response.items;
      },
      error => {
        this.toast.error(error);
      }
    )
  }

  remove(id) {
    this.service.delete(id).subscribe(
      data => {
        this.toast.info('Item has been removed');
        this.getPage();
      },
      error => {
        this.toast.error(error);
      }
    )
  }
}
