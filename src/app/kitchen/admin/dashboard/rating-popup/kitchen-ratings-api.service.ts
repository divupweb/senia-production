import {Injectable} from '@angular/core';
import {AppUrlsService, ApiClientService} from "app/services";

@Injectable()
export class KitchenRatingsApiService {
  constructor(public apiClient: ApiClientService, private appUrls: AppUrlsService) {}

  baseUrl(isEmployee) {
    if (isEmployee) return this.appUrls.kitchenEmployeeUser() + '/employee/ratings/';
    return this.appUrls.kitchenRoot() + '/admin/ratings/'
  }

  getListForSubscription(subscription, date, isEmployee) {
    return this.apiClient.get(this.baseUrl(isEmployee) + subscription, { date: date }).map((responseData) => responseData.json());
  }
}
