import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AppUrlsService, ApiClientService } from "app/services";

@Injectable()
export class DishCategoriesApiService {
  constructor(public apiClient: ApiClientService, private appUrls: AppUrlsService) {
  }

  dishesBase = this.appUrls.kitchenRoot() + '/admin/dish_categories/';

  getList() {
    return this.apiClient.get(this.dishesBase, {}).map((r) => r.json());
  }

  get(params) {
    return this.apiClient.get(this.dishesBase + 'paginated', params).map((r) => r.json());
  }

  create(data) {
    return this.apiClient.post(this.dishesBase, data).map((r) => r.json());
  }
}
