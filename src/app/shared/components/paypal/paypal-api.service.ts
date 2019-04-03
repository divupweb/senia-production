import { Injectable } from '@angular/core';
import { ApiClientService } from 'app/services';

@Injectable()
export class PaypalApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/paypal';

  getConfirmUrl() {
    return this.apiClient.post(this.baseUrl + '/confirm_url').map((r) => r.json())
  }
}
