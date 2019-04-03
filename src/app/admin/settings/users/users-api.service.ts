import { Injectable } from '@angular/core';
import {ApiClientService, ObjectLoader} from "app/services";
import {Observable} from "rxjs/Observable";

@Injectable()
export class UsersApiService {
  constructor(public apiClient: ApiClientService) {}
  baseURL = '/admin/users/';

  public index(params: {page: number, per_page: number}) {
    return this.apiClient.get(this.baseURL, params).map((res) => res.json());
  }

  public get(id) {
    return this.apiClient.get(this.baseURL + id).map((res) => res.json());
  }

  public deleteImage(id): Observable<any> {
    return this.apiClient.delete(this.baseURL + id + '/image').map((res) => res.json());
  }

  public remove(id) {
    return this.apiClient.delete(this.baseURL + id).map((res) => res.json());
  }

  public update(id, user, image = null) {
    return this.apiClient.put(this.baseURL + id, this.buildPayload(user, image)).map((res) => res.json());
  }

  public create(user, image = null) {
    return this.apiClient.post(this.baseURL, this.buildPayload(user, image)).map((res) => res.json())
  }

  protected buildPayload(object: any, image: any = null): any {
    const payload = ObjectLoader.toSnakeCase(object);
    if (image) {
      const formData = ObjectLoader.toFormData(payload);
      formData.append('image', image);
      return formData;
    } else {
      return JSON.stringify(payload);
    }
  }
}
