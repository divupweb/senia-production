import {Injectable} from '@angular/core';
import {URLSearchParams} from "@angular/http";
import { ApiClientService, ObjectLoader } from "app/services";

@Injectable()
export class SharedLocationsApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/admin/shared_locations';

  private prepareData(data) {
    let obj = ObjectLoader.toSnakeCase(data)
    obj['address2'] = obj['address_2']
    delete obj['address_2'];
    if (!obj.id) delete obj.id;
    return JSON.stringify(obj)
  }

  dropSpots() {
    return this.apiClient.get(this.baseUrl).map(ObjectLoader.json);
  }

  save(data) {
    return this.apiClient.put(this.baseUrl, this.prepareData(data)).map(ObjectLoader.json);
  }
}
