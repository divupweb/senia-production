import { Injectable } from '@angular/core';
import { ApiClientService } from 'app/services';


@Injectable()
export class SuperAdminAccountImagesService {
  urlBase(type) {
    return type == 'logo' ? '/super/account_logos' : '/super/account_images';
  }

  constructor(public apiClient: ApiClientService) {}

  imageUrl(type = '') {
    return this.apiClient.fullPath(this.urlBase(type));
  }

  delete(id, type = '') {
    return this.apiClient.delete(this.urlBase(type) + "/" + id).map((responseData) => responseData.json())
  }
}
