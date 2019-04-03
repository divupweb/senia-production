import { Injectable } from '@angular/core';
import { ApiClientService } from "app/services";

@Injectable()
export class DashboardApiService {
  constructor(public apiClient: ApiClientService) { }

  baseUrl = '/company/orders/';

  get(dates) {
    return this.apiClient.get(this.baseUrl + 'dashboard', {dates: dates}).map((responseData) => responseData.json());
  }

  getPopupData(type, date, subscription) {
    return this.apiClient.get(this.baseUrl + type + '/' + subscription, {date: date}).map((responseData) => responseData.json());
  }

  updateCompany(data) {
    return this.apiClient.put('/company', JSON.stringify(data)).map((responseData) => responseData.json());
  }
}
