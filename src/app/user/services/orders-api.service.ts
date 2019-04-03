import {Injectable} from '@angular/core';
import {ApiClientService} from '../../services';

@Injectable()
export class OrdersApiService {
  constructor(public apiClient:ApiClientService) {
  }

  public baseUrl = '/user/orders/';

  getSubscriptions() {
    return this.apiClient.get(this.baseUrl + 'subscriptions', {}).map(responseData => responseData.json());
  }

  getWeekData(subscription, weekStart) {
    return this.apiClient.get(this.baseUrl + subscription, { week_start: weekStart}).map(responseData => responseData.json());
  }

  getAvailableDishes(day, subscription) {
    return this.apiClient.get(this.baseUrl + 'available_dishes', { day: day, subscription: subscription}).map(responseData => responseData.json());
  }

  updateOrder(day, subscription, formData) {
    let processedData = { id: formData['id'], dishes: [] };
    _.each(formData['dishes'], (dishData) => {
      if (dishData['quantity'] > 0) {
        processedData['dishes'].push(
          { dish_id: dishData['dishId'], quantity: dishData['quantity'] }
        );
      }
    });
    let payload = JSON.stringify(_.merge(processedData, { day: day, subscription: subscription}));
    return this.apiClient.put(this.baseUrl + 'update', payload).map(responseData => responseData.json());
  }

  cancelOrder(day, subscription) {
    return this.apiClient.delete(this.baseUrl + 'cancel?day=' + day + '&subscription=' + subscription).map(responseData => responseData.json());
  }
}
