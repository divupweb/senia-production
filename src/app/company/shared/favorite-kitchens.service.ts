import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';

@Injectable()
export class FavoriteKitchensService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/company/favorite_kitchens';

  add(id) {
    return this.apiClient.post(this.baseUrl + '/' + id).map(responseData => responseData.json())
  }

  remove(id) {
    return this.apiClient.delete(this.baseUrl + '/' + id).map(responseData => responseData.json())
  }
}
