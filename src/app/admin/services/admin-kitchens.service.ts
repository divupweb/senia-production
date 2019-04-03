import { Injectable } from '@angular/core';
import { ApiClientService } from 'app/services';
import { GenerateInvoice } from "app/services"
import {RegisterKitchenService} from "app/shared/auth/kitchen-register";

@Injectable()
export class AdminKitchensService implements GenerateInvoice {
  constructor(public apiClient: ApiClientService, private kitchenService: RegisterKitchenService) {}
  kitchenBase = '/admin/kitchens/';

  public getList(params: {page: number, per_page: number, query?: any}) {
    return this.apiClient.get(this.kitchenBase, params).map((res) => res.json())
  }

  public getAllKitchens() {
    return this.apiClient.get(this.kitchenBase + 'all').map((responseData) => responseData.json());
  }

  public getItem(id) {
    return this.apiClient.get(this.kitchenBase + id).map((res) => res.json())
  }

  public removeItem(id) {
    return this.apiClient.delete(this.kitchenBase + id).map((res) => res.json())
  }

  public update(kitchen, subscriptions, image, accountsKitchens) {
    delete kitchen.imageId;
    let data = this.kitchenService.kitchenData(kitchen, subscriptions, image, accountsKitchens);
    return this.apiClient.put(this.kitchenBase + kitchen.id, data).map((res) => res.json())
  }

  public create(kitchen, image) {
    let payload = this.kitchenService.kitchenData(kitchen, [], image);
    return this.apiClient.post(this.kitchenBase, payload).map((res) => res.json())
  }

  public sendMessage(id, data) {
    return this.apiClient.post(`${this.kitchenBase}${id}/send_message`, JSON.stringify(data)).map((res) => res.json())
  }

  public approveItem(id) {
    return this.apiClient.post(this.kitchenBase + id + '/approve').map((res) => res.json())
  }

  public rejectItem(id) {
    return this.apiClient.post(this.kitchenBase + id + '/reject').map((res) => res.json())
  }

  public generateInvoice(id, period) {
    return this.apiClient.post(this.kitchenBase + id + '/generate_invoice', JSON.stringify({ period: period })).map((res) => res.json())
  }

  imageUrl(id) {
    let tail = id ? '?id=' + id : '';
    return this.apiClient.fullPath(this.kitchenBase + 'image' + tail);
  }

  public submitFakeLogin(id): any {
    return this.apiClient.post(this.kitchenBase + id + '/become').map((res) => res.json());
  }

  public getPendingList(params: {all?: boolean, page?: number, per_page?: number}) {
    return this.apiClient.get(this.kitchenBase + 'pending', params).map((res) => res.json())
  }

  public getAutocomplete(query: string) {
    return this.apiClient.get('/kitchens/autocomplete', { query: query })
      .map((res) => res.json() || [])
  }

  getkitchenDiscount(id) {
    return this.apiClient.get(this.kitchenBase + id + '/discounts').map((res) => res.json())
  }

  saveKitchenDiscount(id, percent, range) {
    let data = JSON.stringify({
      percent: percent,
      start_date: range[0],
      end_date: range[1]
    });
    return this.apiClient.post(this.kitchenBase + id + '/discounts', data).map((res) => res.json());
  }

  getAccounts() {
    return this.apiClient.get(this.kitchenBase + '/accounts').map((res) => res.json());
  }

  employees(id) {
    return this.apiClient.get(this.kitchenBase + id + '/employees').map((res) => res.json())
  }

  messages(id, offset = 0) {
    return this.apiClient.get(this.kitchenBase + id + '/messages', { offset: offset })
                         .map((res) => res.json());
  }

  changeActive(id, active) {
    return this.apiClient.put(this.kitchenBase + id + '/change_active', { active: active }).map((res) => res.json());
  }
}
