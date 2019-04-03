import {Injectable} from '@angular/core';
import {ApiClientService, AppStateService, ObjectLoader} from "../../services";
import {URLSearchParams} from "@angular/http";

@Injectable()
export class SharedLocationsApiService {
  constructor(public apiClient: ApiClientService, private appState: AppStateService) {}

  baseUrl = '/admin/shared_locations/';

  prepareData(data) {
    let obj = ObjectLoader.toSnakeCase(data)
    if (obj['address_2']) {
      obj['address2'] = obj['address_2']
      delete obj['address_2']
    }
    return JSON.stringify(obj)
  }

  getCompanies() {
    return this.apiClient.get(this.baseUrl + 'companies').map((responseData) => responseData.json());
  }

  getList() {
    return this.apiClient.get(this.baseUrl).map((responseData) => responseData.json());
  }

  getItem(id) {
    return this.apiClient.get(this.baseUrl + id).map((responseData) => responseData.json());
  }

  create(data) {
    return this.apiClient.post(this.baseUrl, this.prepareData(data)).map((responseData) => responseData.json());
  }

  update(id, data) {
    return this.apiClient.put(this.baseUrl + id, this.prepareData(data)).map((responseData) => responseData.json());
  }

  delete(id) {
    return this.apiClient.delete(this.baseUrl + id).map((responseData) => responseData.json());
  }
}
