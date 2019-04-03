import {Injectable} from '@angular/core';
import {ApiClientService} from "./api-client.service";

@Injectable()
export class CompanyInfoApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/company_info';

  get(companyNumber) {
    return this.apiClient.get(this.baseUrl, { number: companyNumber }).map((r) => r.json())
  }
}
