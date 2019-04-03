import { ApiClientService } from '../../services';
import { Injectable } from '@angular/core';

@Injectable()
export class CompanySettingsApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/company/settings/';

  update(data) {
    var params = JSON.stringify({
      email: data.email,
      phone: data.phone,

      bank_account: data.bankAccount,
      location_attributes: {
        address: data.address,
        address2: data.address2,
        zip_code: data.zipCode,
        floor: data.floor,
      }
    });
    return this.apiClient.put(this.baseUrl, params).map(responseData => responseData.json())
  }

  get() {
    return this.apiClient.get(this.baseUrl).map(responseData => responseData.json())
  }

}
