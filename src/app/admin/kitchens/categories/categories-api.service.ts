import { ApiClientService } from 'app/services';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoriesApiService {
  constructor(public apiClient: ApiClientService) { }

  categoriesBase(kitchenId) {
    return `/admin/kitchens/${kitchenId}/dish_categories/`
  }

  getList(kitchenId) {
    return this.apiClient.get(this.categoriesBase(kitchenId)).map((responseData) => responseData.json());
  }

  create(kitchenId, data) {
    return this.apiClient.post(this.categoriesBase(kitchenId), data).map((responseData) => responseData.json())
  }

  update(id, kitchenId, data) {
    return this.apiClient.put(this.categoriesBase(kitchenId) + id, data).map((responseData) => responseData.json())
  }

  delete(id, kitchenId) {
    return this.apiClient.delete(this.categoriesBase(kitchenId) + id).map((responseData) => responseData.json())
  }

}
