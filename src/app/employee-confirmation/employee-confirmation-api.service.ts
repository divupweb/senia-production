import { Injectable } from '@angular/core';
import { ApiClientService } from '../services';

@Injectable()
export class EmployeeConfirmationApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/confirm_employee/';

  confirmationData(data) {
    return JSON.stringify(
      {
        password: data['password'],
        password_confirmation: data['passwordConfirmation']
      }
    );
  }

  confirm(token, data) {
    return this.apiClient.post(this.baseUrl + token, this.confirmationData(data)).map(responseData => responseData.json())
  }
}
