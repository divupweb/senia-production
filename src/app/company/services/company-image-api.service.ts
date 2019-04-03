import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';

@Injectable()
export class CompanyImageApiService {
  constructor(public apiClient: ApiClientService) { }

  urlBase = '/company/image/';

  url() {
    return this.apiClient.fullPath(this.urlBase);
  }

  delete() {
    return this.apiClient.delete(this.urlBase).map(responseData => responseData.json())
  }

  get() {
    return this.apiClient.get(this.urlBase).map(responseData => responseData.json())
  }
}
