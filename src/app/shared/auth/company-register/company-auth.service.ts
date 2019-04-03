import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {
  ToastService,
  ApiClientService
} from "app/services";


@Injectable()
export class CompanyAuthService {
  protected codesForHandling: number[] = [422];
  constructor(private _apiClient: ApiClientService,
              private toastService: ToastService) {}

  authData(data) {
    return JSON.stringify({
      company_params: {
        name: data['companyName'],
        location_attributes: {
            address: data['address'],
            floor: data['floor'],
            zip_code: data['zipCode']
        }
      },
      user_params: {
        first_name: data['firstName'],
        last_name: data['lastName'],
        phone: data['userPhone'],
        email: data['email'],
        password: data['password']
      },
      account_params: {
        id: data['accountId'],
        name: data['accountName']
      }
    });
  }

  private handleResponse(request) {
    let source = new Subject();
    request.subscribe(
      (response) => {
        let data = response.json();
        if (data['message']) this.toastService.warning(data.message);
        source.next(data);
        source.complete();
      },
      (error) => {
        if (_.includes(this.codesForHandling, error.status)) {
          source.error(error.json());
        } else {
          this.toastService.error(error);
        }
      });

    return source.asObservable();
  }

  submitRegister(data) {
    return this.handleResponse(this._apiClient.post('/companies/register', this.authData(data)));
  }
}
