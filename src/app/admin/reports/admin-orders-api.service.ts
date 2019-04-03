import { ApiClientService } from '../../services';
import { Injectable } from '@angular/core';

@Injectable()
export class AdminOrdersApiService {
  constructor(public apiClient: ApiClientService) {}

  baseURL(resource) {
    return `/admin/reports/${resource}/`
  }
  public get(date, subscription, resource) {
    return this.apiClient.get(this.baseURL(resource) + subscription, { week_start: date }).map(res => res.json())
  }
}
