import { Injectable } from '@angular/core';
import { ApiClientService } from '../../../../services';

@Injectable()
export class CompanyKitchensApiService {
  constructor(public apiClient: ApiClientService) {
  }

  kitchensBase = '/company/kitchens';

  getList() {
    return this.apiClient.get(this.kitchensBase).map(responseData => responseData.json());
  }
}
