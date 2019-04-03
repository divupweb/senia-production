import { Injectable } from '@angular/core';
import { ToastService, ApiClientService } from "app/services";

@Injectable()
export class AdminPendingService {
  constructor(public apiClient: ApiClientService,
              private toastService: ToastService) {}
  urlBase = '/admin/pending';

  public count: any = {
    kitchens: 0,
    companies: 0,
    total_kitchens: 0,
    total_companies: 0,
    feedback: 0
  };


  private getCount() {
    return this.apiClient.get(this.urlBase + '/count').map((res) => res.json())
  }

  public updateCount() {
    this.getCount().subscribe(
      (response) => this.count = response,
      (error) => this.toastService.error(error)
    )
  }
}
