import { Injectable } from '@angular/core';
import { AppUrlsService, ApiClientService } from "../../services";

@Injectable()
export class KitchenSubscriptionsApiService {

  constructor(public apiClient: ApiClientService, private appUrls: AppUrlsService) {}

  baseUrl(isEmployee: boolean = false): string {
    if (isEmployee) return this.appUrls.kitchenEmployeeUser() + '/employee/subscriptions/';
    return this.appUrls.kitchenRoot() + '/admin/subscriptions/'
  }

  get(isEmployee: boolean = false) {
    return this.apiClient.get(this.baseUrl(isEmployee)).map((responseData) => responseData.json());
  }

}
