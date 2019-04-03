import { Injectable } from '@angular/core';
import { AppUrlsService, ApiClientService } from "../../../../services";

@Injectable()
export class DishesApiService {
  constructor(public apiClient: ApiClientService, private appUrls: AppUrlsService) { }

  urlBase(isEmployee) {
    if (isEmployee) return this.appUrls.kitchenEmployeeUser() + '/employee/dishes'
    else return this.appUrls.kitchenRoot() + '/admin/dishes';
  }

  getAll(isEmployee = false) {
    return this.apiClient.get(this.urlBase(isEmployee)).map((r) => r.json());
  }

  get(id, isEmployee = false) {
    return this.apiClient.get(this.dishUrl(id, isEmployee)).map((r) => r.json());
  }

  create(data, isEmployee = false) {
    return this.apiClient.post(this.urlBase(isEmployee), data).map((r) => r.json());
  }

  update(id, data, isEmployee) {
    return this.apiClient.put(this.dishUrl(id, isEmployee), data).map((r) => r.json());
  }

  deactivate(id, isEmployee) {
    return this.apiClient.post(this.dishUrl(id, isEmployee) + '/deactivate').map((r) => r.json());
  }

  activate(id, isEmployee) {
    return this.apiClient.post(this.dishUrl(id, isEmployee) + '/activate').map((r) => r.json());
  }

  private dishUrl(id, isEmployee) {
    return `${this.urlBase(isEmployee)}/${id}`;
  }
}
