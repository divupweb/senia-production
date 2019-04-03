import {Injectable} from '@angular/core';
import {ApiClientService} from "./api-client.service";
import {Observable} from "rxjs/Observable";
import { Response } from '@angular/http'

@Injectable()
export class AccountsApiService {
  constructor(public apiClient: ApiClientService) {}
  baseUrl = '/accounts';

  autocomplete(query = null) {
    return this.apiClient.get(this.baseUrl, { query: query }).map((r) => r.json());
  }

  withoutCurrent() {
    return this.apiClient.get(this.baseUrl + '/others').map((r) => r.json());
  }

  info() {
    return this.apiClient.get(`${this.baseUrl}/info`).map((r) => (r).json())
  }

  public getCompanies(accountName: string): Observable<any> {
    return this.apiClient.get(`${this.baseUrl}/${accountName}/companies`).map((r: Response) => r.json());
  }
}
