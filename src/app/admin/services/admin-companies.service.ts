import { Injectable } from '@angular/core';
import { ApiClientService, ObjectLoader } from 'app/services';
import { GenerateInvoice } from "app/services"
import { Observable } from "rxjs/Observable";

@Injectable()
export class AdminCompaniesService implements GenerateInvoice {
  constructor(public apiClient: ApiClientService) {}
  urlBase = '/admin/companies/';

  private companyData(data) {
    let changeAddress = (obj) => {
      obj.company_params.location_attributes.address2 = obj.company_params.location_attributes.address_2
      delete obj.company_params.location_attributes.address_2;
      return obj;
    };
    return _.flow(ObjectLoader.toSnakeCase, changeAddress, ObjectLoader.toFormData)(data);
  }

  public getList(params: {page: number, per_page: number, query?: any }): Observable<any> {
    return this.apiClient.get(this.urlBase, params).map((res) => res.json())
  }

  public search(query) {
    return this.apiClient.get(this.urlBase + 'search', { query: encodeURIComponent(query)}).map(ObjectLoader.json)
  }

  public getPendingList(params: {page?: number, per_page?: number, all?: boolean }): Observable<any> {
    return this.apiClient.get(this.urlBase + 'pending', params).map((res) => res.json())
  }

  public getItem(id) {
    return this.apiClient.get(this.urlBase + id).map((res) => res.json())
  }

  public removeItem(id) {
    return this.apiClient.delete(this.urlBase + id).map((res) => res.json())
  }

  public addKitchen(id, kitchenId) {
    return this.apiClient.post(this.urlBase + id + `/kitchens/${kitchenId}`).map((res) => res.json())
  }

  public removeKitchen(id, kitchenId) {
    return this.apiClient.delete(this.urlBase + id + `/kitchens/${kitchenId}`).map((res) => res.json())
  }

  public update(id, data) {
    return this.apiClient.put(this.urlBase + id, this.companyData(data)).map((res) => res.json())
  }

  public create(data) {
    return this.apiClient.post(this.urlBase, this.companyData(data)).map((res) => res.json())
  }

  public sendMessage(id, data) {
    return this.apiClient.post(`${this.urlBase}${id}/send_message`, JSON.stringify(data)).map((res) => res.json())
  }

  public approveItem(id) {
    return this.apiClient.post(this.urlBase + id + '/approve').map((res) => res.json())
  }

  public rejectItem(id) {
    return this.apiClient.post(this.urlBase + id + '/reject').map((res) => res.json())
  }

  public generateInvoice(id, period) {
    return this.apiClient.post(this.urlBase + id + '/generate_tripletex_invoice', JSON.stringify({ period: period })).map((res) => res.json())
  }

  public submitFakeLogin(id): any {
    return this.apiClient.post(this.urlBase + id + '/become').map((res) => res.json());
  }

  public getEmployees(query): Observable<any> {
    return this.apiClient.get(this.urlBase + 'employees', { query:  encodeURIComponent(query)}).map((res) => res.json());
  }

  public becomeEmployee(id) {
    return this.apiClient.post(this.urlBase + 'employees/become', JSON.stringify({ employee_id: id })).map((res) => res.json());
  }

  public getDiscount(id) {
    return this.apiClient.get(this.urlBase + id + '/discounts').map((res) => res.json());
  }

  public saveDiscount(id, formData, range, employeeIds) {
    let data = JSON.stringify({
      percent: formData.percent,
      employee_percent: formData.employeePercent,
      start_date: range[0],
      end_date: range[1],
      employee_ids: employeeIds
    })
    return this.apiClient.post(this.urlBase + id + '/discounts', data).map((res) => res.json());
  }

  public getCompanyEmployees(id) {
    return this.apiClient.get(this.urlBase + id + '/employees').map((res) => res.json());
  }

  public setCredit(id, formData, employeeIds) {
    let data = JSON.stringify({
      credit: formData.credit,
      employee_credit: formData.employeeCredit,
      employee_ids: employeeIds
    })
    return this.apiClient.post(this.urlBase + id + '/credits', data).map((res) => res.json());
  }

  public transfer(id, accountId) {
    return this.apiClient.put(this.urlBase + id + '/transfer', JSON.stringify({region_id: accountId})).map((res) => res.json());
  }

  employees(id) {
    return this.getCompanyEmployees(id);
  }

  messages(id, offset = 0) {
    return this.apiClient.get(this.urlBase + id + '/messages', { offset: offset })
                         .map((res) => res.json());
  }

  changeActive(id, active) {
    return this.apiClient.put(this.urlBase + id + '/change_active', { active: active }).map((res) => res.json());
  }
}
