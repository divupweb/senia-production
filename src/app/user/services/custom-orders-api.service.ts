import { Response } from "@angular/http";
import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';
import { Observable } from "rxjs";

interface IOrder {
  kitchen_dish_category_id: number;
  amount: number;
  id?: number;
}

@Injectable()
export class CustomOrdersApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/mobile/custom_orders/';

  createOrUpdate(subscription, date, kitchenDishCategoryId, amount) {
    const params = JSON.stringify({
      subscription,
      date,
      kitchen_dish_category_id: kitchenDishCategoryId,
      amount
    });
    return this.apiClient.post(this.baseUrl, params).map((responseData) => responseData.json());
  }

  public weekly(date: string): Observable<any> {
    return this.apiClient.get(`${this.baseUrl}weekly`, { date } ).map((responseData) => responseData.json());
  }

  public bunchCreateOrUpdate(date: string, subscription: string, orders: IOrder[]): Observable<any> {
    return this.apiClient.put(this.baseUrl, JSON.stringify({ date, subscription, orders }))
      .map((response) => response.json());
  }
}
