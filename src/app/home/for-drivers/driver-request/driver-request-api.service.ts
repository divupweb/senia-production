import {Injectable} from '@angular/core';

import { ApiClientService, ObjectLoader } from "app/services";


@Injectable()
export class DriverRequestApiService {
  constructor(private _apiClient: ApiClientService) {}

  submit(data) {
    return this._apiClient.post('/driver_requests', JSON.stringify(ObjectLoader.toSnakeCase(data)));
  }
}
