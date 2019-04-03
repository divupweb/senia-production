import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import { AppStateService, ApiClientService } from "../../services";
import { GenerateInvoice } from "app/services"
@Injectable()
export class LogisticsDashboardApiService implements GenerateInvoice {
  constructor(public apiClient: ApiClientService, private appState: AppStateService) {}

  baseUrl(isKitchen) {
    if (!!isKitchen) {
      if(this.appState.kitchenAdmin()) return '/kitchens/' + this.appState.kitchenAdmin() + '/admin/schedule/'
      else return '/kitchens/' + this.appState.kitchenLogisticsUser() + '/logistics/schedule/'
    } else {
      return '/logistics/schedule/'
    }
  }

  getSubscriptions(dates, isKitchen) {
    return this.apiClient.get(this.baseUrl(isKitchen) + 'subscriptions', {dates: dates}).map((responseData) => responseData.json())
  }

  getStatuses(dates, isKitchen) {
    return this.apiClient.get(this.baseUrl(isKitchen) + 'statuses', {dates: dates}).map((responseData) => responseData.json())
  }

  public generateInvoice(id, period) {
    return this.apiClient.post('/logistics/invoices', JSON.stringify({ period: period })).map((res) => res.json())
  }
}
