import {Injectable} from '@angular/core';
import {ApiClientService} from '../../../services';

@Injectable()
export class ForgotPasswordService {
  constructor(private apiClient: ApiClientService ) { }

  post(data) {
    return this.apiClient.post('/forgot_password', JSON.stringify(data));
  }
}
