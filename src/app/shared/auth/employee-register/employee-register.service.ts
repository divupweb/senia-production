import { Injectable } from '@angular/core';
import { ApiClientService } from '../../../services';


@Injectable()
export class RegisterEmployeeService {
  constructor(public apiClient: ApiClientService) {}

  employeeBase = "/employees";
  public create(employee) {
    return this.apiClient.post(this.employeeBase, this.employeeData(employee));
  }

  public employeeData(employee) {
    let payload = _.mapKeys(employee, (val, key: string) => { return _.snakeCase(key); });
    return JSON.stringify(payload);
  }
}
