import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';

@Injectable()
export class KitchenImagesApiService {
  constructor(public apiClient: ApiClientService) { }

  urlBase = '/admin/kitchen_images/';

  delete(id) {
    return this.apiClient.delete(this.urlBase + id).map(responseData => responseData.json())
  }
}
