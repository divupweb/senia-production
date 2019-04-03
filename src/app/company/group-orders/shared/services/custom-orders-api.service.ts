import { Injectable } from '@angular/core';
import { ApiClientService, AppStateService } from '../../../../services';

@Injectable()
export class CustomOrdersApiService {
  constructor(public apiClient: ApiClientService, private appState: AppStateService) {}

  baseUrl = '/company/custom_orders';

  put(data) {
    var params = JSON.stringify(data);
    return this.apiClient.put(this.baseUrl, params).map((r) => r.json())
  }

  calendar(dates) {
    return this.apiClient.get(this.baseUrl + '/calendar', { dates: dates }).map((r) => r.json());
  }

  available() {
    return this.apiClient.get(this.baseUrl + '/available').map((r) => r.json());
  }
}
