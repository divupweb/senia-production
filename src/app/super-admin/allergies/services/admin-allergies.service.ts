import { Injectable } from '@angular/core';
import { ApiClientService } from 'app/services';

@Injectable()
export class AdminAllergiesService {
  constructor(public apiClient: ApiClientService) {}
  urlBase = '/super/allergies/';

  private allergyData(data) {
    let params = _.reduce(data.names, (res, v) => {
      res[v.locale] = v.name;
      return res;
    }, {});
    return JSON.stringify({
      name_translations: params,
      image_id: data['imageId']
    });
  }

  public getList(params: {page: number, per_page: number}) {
    return this.apiClient.get(this.urlBase, params).map((res) => res.json())
  }

  public getItem(id) {
    return this.apiClient.get(this.urlBase + id).map((res) => res.json())
  }

  public removeItem(id) {
    return this.apiClient.delete(this.urlBase + id).map((res) => res.json())
  }

  public update(id, data) {
    return this.apiClient.put(this.urlBase + id, this.allergyData(data)).map((res) => res.json())
  }

  public create(data) {
    return this.apiClient.post(this.urlBase, this.allergyData(data)).map((res) => res.json())
  }

}
