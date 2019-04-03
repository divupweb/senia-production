import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';

@Injectable()
export class ProspectiveAccountsApiService {
  constructor(public apiClient: ApiClientService) {}
  urlBase = '/super/prospective-accounts';

  index(params: {page: number, per_page: number}) {
    return this.apiClient.get(this.urlBase, params).map(res => res.json())
  }

  delete(id) {
    return this.apiClient.delete(this.urlBase + '/' + id);
  }
}
