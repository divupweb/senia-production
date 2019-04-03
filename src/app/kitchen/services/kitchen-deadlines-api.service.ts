import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import { ApiClientService, AppUrlsService } from "../../services/";

@Injectable()
export class KitchenDeadlinesApiService {

  constructor(public apiClient: ApiClientService, private appUrls: AppUrlsService) {
  }

  public baseUrl = this.appUrls.kitchenRoot() + '/admin/deadlines';

  get(day: number, subscription: string) {
    return this.apiClient.get(this.baseUrl, { day, subscription }).map(responseData => responseData.json());
  }

  getAll(subscription: string): Observable<any> {
    return this.apiClient.get(`${this.baseUrl}/all`, { subscription }).map(responseData => responseData.json());
  }

  put(data): Observable<any> {
    return this.apiClient.put(this.baseUrl, data ).map(responseData => responseData.json());
  }

}
