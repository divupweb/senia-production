import { Injectable } from '@angular/core';
import {ApiClientService, ObjectLoader} from "app/services";
import {Observable} from "rxjs/Observable";

@Injectable()
export class SuspendsApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/admin/suspends';

  index(params) {
    return this.apiClient.get(`${this.baseUrl}/index`, params).map((r) => r.json());
  }

  get(id) {
    return this.apiClient.get(`${this.baseUrl}/${id}`).map((r) => r.json());
  }

  create(startDate, endDate, name, description) {
    let params = {
      start_date: startDate,
      end_date: endDate,
      name: name,
      description: description
    }

    return this.apiClient.post(this.baseUrl, JSON.stringify(params)).map((r) => r.json());
  }

  delete(startDate, endDate) {
    let params = {
      start_date: startDate,
      end_date: endDate
    }

    return this.apiClient.delete(this.baseUrl, params).map((r) => r.json());
  }

  deleteById(ids: number[]): Observable<any> {
    return this.apiClient.delete(`${this.baseUrl}/by_ids`, { ids }).map(ObjectLoader.json);
  }

  events() {
    return this.apiClient.get(`${this.baseUrl}/events`).map((r) => r.json());
  }

  public pending(): Observable<any> {
    return this.apiClient.get(`${this.baseUrl}/pending`).map(ObjectLoader.json);
  }
}
