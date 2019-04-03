import { Injectable } from '@angular/core';
import { ApiClientService } from '../../../../services';

@Injectable()
export class CompanyDailyKitchensApiService {
  constructor(public apiClient: ApiClientService) {
  }

  public dailyKitchensBase = '/company/daily_kitchens';

  getList() {
    return this.apiClient.get(this.dailyKitchensBase).map(responseData => responseData.json());
  }
}
