import { Injectable } from '@angular/core';
import { AppUrlsService, ApiClientService } from "../../../../services";

@Injectable()
export class IngredientsApiService {
  constructor(public apiClient: ApiClientService, private appUrls: AppUrlsService) {
  }

  urlBase = this.appUrls.kitchenRoot() + '/admin/ingredients';

  autocomplete(query) {
    return this.apiClient.get(this.urlBase, { query }).map((r) => r.json());
  }
}
