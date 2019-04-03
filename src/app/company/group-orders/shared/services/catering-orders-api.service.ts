import { Injectable } from '@angular/core';
import { ApiClientService, AppStateService } from '../../../../services';

@Injectable()
export class CateringOrdersApiService {
  constructor(public apiClient: ApiClientService, private appState: AppStateService) { }

  baseUrl = '/company/catering';

  put(data) {
    var params = JSON.stringify(data);
    return this.apiClient.put(this.baseUrl, params).map((r) => r.json())
  }
}
