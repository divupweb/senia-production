import { Injectable } from '@angular/core';
import { ApiClientService } from '../../../services';


@Injectable()
export class AdminAllergyImagesService {
  urlBase = '/super/allergy_images';

  constructor(public apiClient: ApiClientService) {}

  imageUrl() {
    return this.apiClient.fullPath(this.urlBase);
  }

  delete(id) {
    return this.apiClient.delete(this.urlBase + "/" + id).map(responseData => responseData.json())
  }
}
