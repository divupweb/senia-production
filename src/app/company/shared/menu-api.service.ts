import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';

@Injectable()
export class MenuApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/company';

  kitchens(date = null) {
    var params;
    if (date) params = { date: date };

    return this.apiClient.get(this.baseUrl + '/kitchens/available', params).map((r) => r.json());
  }

  menu(subscription, kitchenId, date = null, day = null) {
    var params = {
      subscription: subscription,
      kitchen_id: kitchenId
    };
    if (date !== null) params['date'] = date
    if (day !== null) params['day'] = day
    let url = this.menuUrl(subscription);

    return this.apiClient.get(url, params).map((r) => r.json());
  }


  cart(subscription, date = null, day = null) {
    var params = {
      subscription: subscription
    };
    if (date !== null)  params['date'] = date;
    if (day !== null)  params['day'] = day;

    return this.apiClient.get(this.baseUrl + '/menu/cart', params).map((r) => r.json());
  }

  private menuUrl(subscription) {
    let path = subscription != 'catering' ? '/menu/kitchen' :'/catering/offers'
    return this.baseUrl + path;
  }
}
