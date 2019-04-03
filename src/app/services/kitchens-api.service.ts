import {Injectable} from '@angular/core';
import {ApiClientService} from "./api-client.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class KitchensApiService {
  constructor(public apiClient: ApiClientService) {}
  baseUrl = '/kitchens';

  get(): Observable<any> {
    return this.apiClient.get(this.baseUrl).map((r) => r.json());
  }
}
