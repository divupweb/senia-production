import { Injectable } from '@angular/core';
import { ApiClientService, ObjectLoader } from 'app/services';

@Injectable()
export class EmployeesOrdersApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/company/employees_orders';

  put(subsidies, daily) {
    let params = ObjectLoader.toSnakeCase({
      subsidiesAttributes: subsidies,
      companySubscriptionsAttributes: daily
    });

    return this.apiClient.put(this.baseUrl, JSON.stringify(params)).map((r) => (r).json());
  }
}
