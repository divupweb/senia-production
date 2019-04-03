import { Injectable } from '@angular/core';
import { ApiClientService, ObjectLoader, AppUrlsService } from "app/services";

@Injectable()
export class NotificationsApiService {
  constructor(private apiClient: ApiClientService, private appUrls: AppUrlsService) { }

  baseUrl(isEmployee = false) {
    if (isEmployee) return `${this.appUrls.kitchenEmployeeUser()}/employee/notifications`;
    return `${this.appUrls.kitchenRoot()}/admin/notifications`
  }

  get(isEmployee = false, offset = 0) {
    return this.apiClient.get(this.baseUrl(isEmployee), { offset }).map(ObjectLoader.json);
  }
}
