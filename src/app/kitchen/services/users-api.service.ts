import {Injectable} from '@angular/core';
import { ApiClientService, AppUrlsService } from "../../services/";


@Injectable()
export class UsersApiService {
  constructor(public apiClient: ApiClientService, private appUrls: AppUrlsService) {}
  baseURL = this.appUrls.kitchenRoot() + '/admin/users/';

  public index(params: {page: number, per_page: number}) {
    return this.apiClient.get(this.baseURL, params).map((res) => res.json())
  }

  public get(id) {
    return this.apiClient.get(this.baseURL + id).map((res) => res.json())
  }

  public getAll() {
    return this.apiClient.get(`${this.baseURL}/all`).map((res) => res.json())
  }

  public remove(id) {
    return this.apiClient.delete(this.baseURL + id).map((res) => res.json())
  }

  public update(id, user) {
    let data = _.mapKeys(user, (val, key: string) =>  _.snakeCase(key));
    return this.apiClient.put(this.baseURL + id, JSON.stringify(data)).map((res) => res.json())
  }

  public create(user) {
    let data = _.mapKeys(user, (val, key: string) =>  _.snakeCase(key));
    return this.apiClient.post(this.baseURL, JSON.stringify(data)).map((res) => res.json())
  }
}
