import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';

@Injectable()
export class DishApiService {
  constructor(private apiClient: ApiClientService) { }
  urlBase = '/user/dishes/';

  getItem(id: string, subscription: string, date: any) {
    return this.apiClient.get(this.urlBase + id, { date: date, subscription: subscription }).map((res) => res.json());
  }

  setPeriodic(id: string, subscription: string, day: number) {
    const params = JSON.stringify({ day: day, subscription: subscription });
    return this.apiClient.post(this.urlBase + id + '/default', params).map((res) => res.json());
  }

  updateOrder(id: string, subscription: string, date: any, amount: number) {
    const params = JSON.stringify({
      date: date,
      subscription: subscription,
      amount: amount,
    });
    return this.apiClient.put(this.urlBase + id, params).map((res) => res.json());
  }
}
