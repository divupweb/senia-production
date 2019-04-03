import {Injectable} from '@angular/core';
import {ApiClientService} from 'app/services';

@Injectable()
export class UserSubscriptionsApi {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/user/subscriptions';

  get(date = null) {
    return this.apiClient.get(this.baseUrl, { date: date }).map((r) => r.json());
  }
}
