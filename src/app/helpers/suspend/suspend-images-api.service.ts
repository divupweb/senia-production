import { Injectable } from '@angular/core';
import { ApiClientService } from 'app/services';

@Injectable()
export class SuspendImagesApiService {
  constructor(public apiClient: ApiClientService) { }

  urlBase = '/admin/suspends/images';

  imageUrl() {
    return this.apiClient.fullPath(this.urlBase);
  }

  delete(id) {
    return this.apiClient.delete(`${this.urlBase}/id`).map((r) => r.json())
  }
}
