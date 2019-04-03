import { Injectable } from '@angular/core';
import { ApiClientService } from "app/services";
import { Observable } from "rxjs/Observable";

@Injectable()
export class DashboardApiService {

  public baseUrl: string = '/admin/dashboard';
  public constructor(protected apiClient: ApiClientService) {}

  public get(dates: any[]): Observable<any> {
    return this.apiClient.get(this.baseUrl, { dates }).map((r) => r.json());
  }

  public packgingUrl(subscription, date) {
    let path = this.apiClient.fullPath(this.baseUrl + '/packaging_lists');
    let params = new URLSearchParams();
    params.set('subscription', subscription);
    params.set('date', date);
    return path  + '?' + params.toString();
  }
}
