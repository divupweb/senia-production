import { Injectable } from '@angular/core';
import { ApiClientService, ObjectLoader } from "app/services";

@Injectable()
export class LogisticsDetailsApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/logistics/delivery_info'

  get() {
    return this.apiClient.get(this.baseUrl).map((responseData) => responseData.json())
  }

  save(data: {}) {
    let params = JSON.stringify(ObjectLoader.toSnakeCase({ delivery_info: data}))
    return this.apiClient.put(this.baseUrl, params).map((responseData) => responseData.json())
  }
}
