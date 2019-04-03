import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';

@Injectable()
export class CompanySubscriptionsApiService {
  constructor(public apiClient: ApiClientService) {}

  urlBase = '/company/company_subscriptions/';

  getList() {
    return this.apiClient.get(this.urlBase).map((responseData) => responseData.json());
  }
}
