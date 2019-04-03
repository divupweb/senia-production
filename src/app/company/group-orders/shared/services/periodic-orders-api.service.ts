import { Injectable } from '@angular/core';
import { ApiClientService, AppStateService } from '../../../../services';

@Injectable()
export class PeriodicOrdersApiService {
  constructor(public apiClient: ApiClientService, private appState: AppStateService) {}

  baseUrl = '/company/periodic_orders';

  put(data) {
    var params = JSON.stringify(data);
    return this.apiClient.put(this.baseUrl, params).map((r) => r.json())
  }

  calendar() {
    return this.apiClient.get(this.baseUrl + '/calendar').map((r) => r.json());
  }
}
