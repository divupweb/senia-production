import { Injectable } from '@angular/core';
import { ApiClientService, ObjectLoader} from "app/services";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AdminProfileApiService {
  constructor(protected apiClient: ApiClientService) {}
  baseURL = '/admin/profile/';

  get() {
    return this.apiClient.get(this.baseURL).map((res) => res.json())
  }

  update(user, image = null) {
    const payload = ObjectLoader.toSnakeCase(user);
    let data;
    if (image) {
      data = ObjectLoader.toFormData(payload);
      (data as FormData).append('image', image)
    } else {
      data = JSON.stringify(payload);
    }
    return this.apiClient.put(this.baseURL, data).map((res) => res.json())
  }

  imageUrl() {
    return this.apiClient.fullPath(this.baseURL + 'image');
  }

  deleteImage(): Observable<any> {
    return this.apiClient.delete(this.baseURL + 'image').map((response) => response.json());
  }
}
