import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';

@Injectable()
export class IngredientsApiService {
  constructor(public apiClient: ApiClientService) {}
  urlBase = '/super/ingredients';

  index(category_id) {
    return this.apiClient.get(this.urlBase + '/ingredients', { category_id: category_id }).map(res => res.json())
  }

  save(id, allergy_ids) {
    var data = JSON.stringify({ id: id, allergy_ids: allergy_ids});
    return this.apiClient.post(this.urlBase + '/ingredient', data).map(res => res.json())
  }

  remove(id) {
    var data = JSON.stringify({ id: id});
    return this.apiClient.post(this.urlBase + '/ingredient/remove', data).map(res => res.json())
  }

  remove_allergy(id, allergy_id) {
    var data = JSON.stringify({ id: id, allergy_id: allergy_id});
    return this.apiClient.post(this.urlBase + '/ingredient/remove_allergy', data).map(res => res.json())
  }
}
