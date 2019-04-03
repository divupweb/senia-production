import { Injectable } from '@angular/core';
import { ApiClientService, ObjectLoader } from 'app/services';

@Injectable()
export class EmployeesApiService {
  constructor(public apiClient: ApiClientService) {
  }

  employeesBase = '/company/employees/';

  employeeData(data, subsidies, subscriptions) {
    let params = {
      subsidiesAttributes: subsidies,
      employeeSubscriptionsAttributes: _.values(subscriptions)
    }
    Object.assign(params, data);

    return JSON.stringify(ObjectLoader.toSnakeCase(params));
  }


  getAll() {
    return this.apiClient.get(this.employeesBase).map((responseData) => responseData.json());
  }

  get(id) {
    return this.apiClient.get(this.employeesBase + id).map((responseData) => responseData.json());
  }

  create(data, subsidies, subscriptions) {
    return this.apiClient.post(this.employeesBase, this.employeeData(data, subsidies, subscriptions)).map((responseData) => responseData.json())
  }

  remove(id) {
    return this.apiClient.delete(this.employeesBase + id).map((responseData) => responseData.json());
  }

  update(id, data, subsidies, subscriptions) {
    let params = this.employeeData(data, subsidies, subscriptions);
    return this.apiClient.put(this.employeesBase + id, params).map((responseData) => responseData.json())
  }

  setActive(id, active) {
    return this.apiClient.put(this.employeesBase + id + '/set_active', JSON.stringify({ active })).map((responseData) => responseData.json())
  }

}
