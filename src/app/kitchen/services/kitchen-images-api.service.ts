import { Injectable } from '@angular/core';
import { ApiClientService, AppUrlsService } from '../../services';

@Injectable()
export class KitchenImagesApiService {
  constructor(private apiClient: ApiClientService,
              private appUrls: AppUrlsService) { }

  baseUrl = this.appUrls.kitchenRoot() + '/admin/images';

  imageUrl() {
    return this.apiClient.fullPath(this.baseUrl);
  }

  delete(id) {
    return this.apiClient.delete(this.baseUrl + "/" + id).map((r) => r.json())
  }
}
