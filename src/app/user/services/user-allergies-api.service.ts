import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';

@Injectable()
export class UserAllergiesApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/user/allergies/';

  get() {
    return this.apiClient.get(this.baseUrl).map(responseData => responseData.json())
  }

  update(allergyIds) {
    var data = JSON.stringify({allergy_ids: allergyIds});
    return this.apiClient.put(this.baseUrl, data).map(responseData => responseData.json())
  }

}
