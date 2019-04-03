import { Injectable } from '@angular/core';
import { ApiClientService, ObjectLoader } from "app/services";

@Injectable()
export class NotificationsApiService {
  constructor(public apiClient: ApiClientService) { }

  baseUrl = '/company/notifications';

  get(offset = 0) {
    return this.apiClient.get(this.baseUrl, { offset }).map(ObjectLoader.json);
  }
}
