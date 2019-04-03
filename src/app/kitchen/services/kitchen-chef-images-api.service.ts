import { Injectable } from '@angular/core';
import { ApiClientService, AppUrlsService } from '../../services';

@Injectable()
export class KitchenChefImagesApiService {
  constructor(public apiClient: ApiClientService,
              private appUrls: AppUrlsService) { }

  protected baseUrl: string = this.appUrls.kitchenRoot() + '/admin/chef_images';

  public uploadUrl(): string {
    return this.apiClient.fullPath(this.baseUrl);
  }

  delete(id) {
    return this.apiClient.delete(this.baseUrl + '/' + id).map(responseData => responseData.json())
  }
}
