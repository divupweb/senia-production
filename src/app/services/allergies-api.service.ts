import {Injectable} from '@angular/core';
import {ApiClientService} from "./api-client.service";

@Injectable()
export class AllergiesApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/allergies';

  get() {
    return this.apiClient.get(this.baseUrl).map(responseData => responseData.json())
  }

}
