import { Injectable } from '@angular/core';
import { ApiClientService } from 'app/services';
import {Observable} from "rxjs/Observable";

@Injectable()
export class SuperAdminRegionsService {
  constructor(public apiClient: ApiClientService) {}
  urlBase = '/super/accounts/';

  public getList(params: {page?: number, per_page?: number, all?: boolean}): Observable<any> {
    return this.apiClient.get(this.urlBase, params).map((res) => res.json())
  }

  public getItem(id) {
    return this.apiClient.get(this.urlBase + id).map((res) => res.json())
  }

  public removeItem(id) {
    return this.apiClient.delete(this.urlBase + id).map((res) => res.json())
  }

  public update(id, data) {
    return this.apiClient.put(this.urlBase + id, JSON.stringify(data)).map((res) => res.json())
  }

  public create(data) {
    return this.apiClient.post(this.urlBase, JSON.stringify(data)).map((res) => res.json())
  }

  currency() {
    return this.apiClient.get(this.urlBase + 'currency_list').map((res) => res.json())
  }

  timeZones() {
    return this.apiClient.get(this.urlBase + 'time_zones').map((res) => res.json())
  }

  emails(id) {
    return this.apiClient.fullPath(`${this.urlBase}${id}/emails`);
  }
}
