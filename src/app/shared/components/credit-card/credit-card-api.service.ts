import { Injectable } from '@angular/core';
import { ApiClientService } from '../../../services';

@Injectable()
export class CreditCardApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/credit_cards';

  getRegisterUrl() {
    return this.apiClient.post(this.baseUrl + '/register').map((r) => r.json())
  }
}
