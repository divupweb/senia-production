import { Injectable } from '@angular/core';
import { ApiClientService, AppStateService } from 'app/services';


@Injectable()
export class PeriodicOrdersApiService {
  constructor(public apiClient: ApiClientService, private appState: AppStateService) {}

  baseUrl = '/user/periodic_orders';

  get() {
    return this.apiClient.get(this.baseUrl).map((r) => r.json())
  }

  options(subscription, day) {
    let params = { subscription: subscription, day: day };
    return this.apiClient.get(`${this.baseUrl}/options`, params).map((r) => r.json())
  }

  update(day, data) {
    let params = JSON.stringify(data);
    return this.apiClient.put(`${this.baseUrl}/${day}`, params).map((r) => r.json())
  }

  updateAll(data) {
    let params = JSON.stringify(data);
    return this.apiClient.put(`${this.baseUrl}/all`, params).map((r) => r.json())
  }
}
