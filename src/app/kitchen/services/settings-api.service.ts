import { Injectable } from '@angular/core';
import { AppUrlsService, ApiClientService } from 'app/services';
import {RegisterKitchenService} from "app/shared/auth/kitchen-register";

@Injectable()
export class KitchenSettingsApiService {
  constructor(public apiClient: ApiClientService,
              private appUrls: AppUrlsService,
              private kitchenService: RegisterKitchenService) { }

  baseUrl(isEmployee = false) {
    if (isEmployee) return this.appUrls.kitchenEmployeeUser() + '/employee/settings/';
    return this.appUrls.kitchenRoot() + '/admin/settings/'
  }

  create(kitchen, subscriptions, isEmployee) {
    return this.apiClient.post(this.baseUrl(isEmployee), this.kitchenService.kitchenData(kitchen, subscriptions)).map((r) => r.json());
  }

  get(isEmployee) {
    return this.apiClient.get(this.baseUrl(isEmployee)).map((r) => r.json());
  }

  getKitchenDishesCategories() {
    return this.apiClient.get(this.appUrls.kitchenRoot() + '/admin/dishes/categories').map((r) => r.json());
  }

  getDiscount() {
    return this.apiClient.get(this.baseUrl() + '/discounts').map((r) => r.json());
  }

  saveDishDiscount(percent, range, dishIds, categoryIds, type) {
    let data = {
      percent: percent,
      start_date: range[0],
      end_date: range[1]
    };
    type == 'dishes' ? data['dish_ids'] = dishIds : data['dish_category_ids'] = categoryIds;
    return this.apiClient.post(this.baseUrl() + '/discounts', JSON.stringify(data)).map((r) => r.json());
  }
}
