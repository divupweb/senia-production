import { Injectable } from '@angular/core';
import { ApiClientService, ObjectLoader } from 'app/services';


@Injectable()
export class RegisterKitchenService {
  constructor(public apiClient: ApiClientService) {}

  kitchenBase = "/kitchens";
  public create(kitchen, subscriptions = []) {
    return this.apiClient.post(this.kitchenBase, this.kitchenData(kitchen, subscriptions))
  }

  public getDishCategories() {
    return this.apiClient.get('/dish_categories')
  }

  public kitchenData(kitchen, subscriptions, image = null, accountsKitchens = []) {
    kitchen.kitchenSubscriptionsAttributes = [];
    kitchen.accountsKitchensAttributes = accountsKitchens;
    subscriptions.forEach((sub) => { if (sub.active || sub.id) kitchen.kitchenSubscriptionsAttributes.push(sub); });
    let payload = ObjectLoader.toSnakeCase(kitchen);
    payload.address2 = payload.address_2;
    delete payload.address_2;
    if (image) {
      const formData = ObjectLoader.toFormData(payload);
      formData.append('image', image);
      return formData;
    } else {
      return JSON.stringify(payload);
    }
  }
}
