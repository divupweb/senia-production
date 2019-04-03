import { Injectable } from '@angular/core';
import { ApiClientService } from 'app/services';

@Injectable()
export class AdminKitchenUpdatesService {
  constructor(public apiClient: ApiClientService) {}
  baseUrl = '/admin/kitchen_updates/';

  public approveUpdate(updateId) {
    return this.apiClient.post(this.baseUrl + updateId + '/approve').map((res) => res.json())
  }

  public rejectUpdate(updateId) {
    return this.apiClient.post(this.baseUrl + updateId + '/reject').map((res) => res.json())
  }
}
