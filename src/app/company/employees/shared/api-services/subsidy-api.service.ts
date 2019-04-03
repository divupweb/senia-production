import { Injectable } from '@angular/core';
import { ApiClientService, AppStateService } from 'app/services';

@Injectable()
export class SubsidyApiService {
  constructor(public apiClient: ApiClientService, private appState: AppStateService) {}

  baseUrl = '/company/subsidies';

  get() {
    return this.apiClient.get(this.baseUrl).map((r) => r.json())
  }

  periods() {
    return this.apiClient.get(this.baseUrl + '/periods').map((r) => r.json())
  }

  valueTypes() {
    return this.apiClient.get(this.baseUrl + '/value_types').map((r) => r.json())
  }
}
