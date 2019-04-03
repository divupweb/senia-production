import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../services';

@Injectable()
export class SignUpWizardApiService {
  constructor(public apiClient: ApiClientService) { }

  baseUrl = '/user/sign-up-wizard';

  get() {
    return this.apiClient.get(this.baseUrl).map((r) => r.json());
  }

  put(params) {
    let data = JSON.stringify(params);
    return this.apiClient.put(this.baseUrl, data).map((r) => r.json());
  }
}
