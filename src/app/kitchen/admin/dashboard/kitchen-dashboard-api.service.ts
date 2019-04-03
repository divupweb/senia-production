import {Injectable} from '@angular/core';
import {ApiClientService, AppUrlsService} from "app/services";
import {URLSearchParams} from "@angular/http";

@Injectable()
export class KitchenDashboardApiService {
  constructor(public apiClient: ApiClientService, private appUrls: AppUrlsService) {}

  baseUrl(isEmployee, resource) {
    if (isEmployee) return `${this.appUrls.kitchenEmployeeUser()}/employee/${resource}/`;
    return `${this.appUrls.kitchenRoot()}/admin/${resource}/`
  }

  get(dates, isEmployee) {
    return this.apiClient.get(this.baseUrl(isEmployee, 'dashboard'), {dates: dates}).map((responseData) => responseData.json());
  }

  getCatering(isEmployee) {
    return this.apiClient.get(this.baseUrl(isEmployee, 'dashboard') + 'catering').map((responseData) => responseData.json());
  }

  getProductionList(isEmployee, accountId, date, subscription, orderId = null) {
    let params = {day: date, subscription: subscription, account_id: accountId};
    if (orderId) params['order_id'] = orderId;
    return this.apiClient.get(this.baseUrl(isEmployee, 'production_lists'), params).map((responseData) => responseData.json());
  }

  getPackagingList(isEmployee, accountId, date, subscription) {
    let params = {day: date, subscription: subscription, account_id: accountId};
    return this.apiClient.get(this.baseUrl(isEmployee, 'packaging_lists'), params).map((responseData) => responseData.json());
  }

  printUrl(isEmployee, accountId, subscription, date, resource, orderId = null) {
    let path = this.apiClient.fullPath(this.baseUrl(isEmployee, resource) + 'print');
    let params = new URLSearchParams();
    params.set('subscription', subscription);
    params.set('account_id', accountId);
    if (date) params.set('day', date);
    if (orderId) params.set('order_id', orderId);
    return path  + '?' + params.toString();
  }

  getCompanyInfo(cateringOrderId, isEmployee) {
    return this.apiClient.get(this.baseUrl(isEmployee, 'catering') + cateringOrderId + '/company_info').map((responseData) => responseData.json());
  }

  acceptOrder(cateringOrderId, isEmployee) {
    return this.apiClient.put(this.baseUrl(isEmployee, 'catering') + cateringOrderId + '/accept').map((responseData) => responseData.json());
  }

  rejectOrder(cateringOrderId, isEmployee) {
    return this.apiClient.delete(this.baseUrl(isEmployee, 'catering') + cateringOrderId).map((responseData) => responseData.json());
  }
}
