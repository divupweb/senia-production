import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { AppUrlsService, ApiClientService } from "app/services";

@Injectable()
export class MenuApiService {
  constructor(
    public apiClient: ApiClientService,
    private appUrls: AppUrlsService) { }

  baseURL(isEmployee) {
    if (isEmployee) return this.appUrls.kitchenEmployeeUser() + '/employee/menus/';
    return this.appUrls.kitchenRoot() + '/admin/menus/';
  }
  menuItemURL(isEmployee) {
    if (isEmployee) return this.appUrls.kitchenEmployeeUser() + '/employee/menu_items/';
    return this.appUrls.kitchenRoot() + '/admin/menu_items/';
  }

  get(args, isEmployee) {
    let params = { week_start: args[1].format() };
    return this.apiClient.get(this.baseURL(isEmployee) + args[0], params).map((data) => data.json());
  }

  saveMenuItem(data, isEmployee) {
    let url = this.menuItemURL(isEmployee);
    let params = JSON.stringify(data);
    return this.apiClient.post(url, params).map((e) => e.json());
  }


  random(args, isEmployee) {
    let params = { subscription: args[0], date: args[1].format() };
    return this.apiClient.post(this.baseURL(isEmployee) + 'random', JSON.stringify(params)).map((data) => data.json());
  }

  copy(args, isEmployee) {
    let params = { subscription: args[0], date: args[1].format() };
    return this.apiClient.post(this.baseURL(isEmployee) + 'copy', JSON.stringify(params)).map((data) => data.json());
  }

  printUrl(subscription, weekStart, isEmployee) {
    let path = this.apiClient.fullPath(this.baseURL(isEmployee) + 'print');
    let params = new URLSearchParams();
    params.set('subscription', subscription);
    params.set('week_start', weekStart.format());

    return path  + '?' + params.toString();
  }
}
