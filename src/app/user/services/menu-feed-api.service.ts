import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';

@Injectable()
export class MenuFeedApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/mobile/menu_feed/';

  get(date, subscriptionType) {
    return this.apiClient.get(this.baseUrl, {date, subscription: subscriptionType}).map((responseData) => responseData.json());
  }
}
