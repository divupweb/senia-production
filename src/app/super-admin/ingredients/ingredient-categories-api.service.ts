import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';

@Injectable()
export class IngredientCategoriesApiService {
  constructor(public apiClient: ApiClientService) {}
  urlBase = '/super/ingredients';

  uploadFileUrl() {
    return this.apiClient.fullPath(this.urlBase);
  }

  allergies() {
    return this.apiClient.get('/super/allergies/all').map(res => res.json())
  }

  get() {
    return this.apiClient.get(this.urlBase + '/categories').map(res => res.json())
  }

  save(id, allergy_ids) {
    var data = JSON.stringify({ id: id, allergy_ids: allergy_ids});
    return this.apiClient.post(this.urlBase + '/category', data).map(res => res.json())
  }

  remove(id) {
    var data = JSON.stringify({ id: id});
    return this.apiClient.post(this.urlBase + '/category/remove', data).map(res => res.json())
  }

  remove_allergy(id, allergy_id) {
    var data = JSON.stringify({ id: id, allergy_id: allergy_id});
    return this.apiClient.post(this.urlBase + '/category/remove_allergy', data).map(res => res.json())
  }
}
