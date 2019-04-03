import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';
import { Observable } from "rxjs";

@Injectable()
export class WeekInfoApiService {
  constructor(public apiClient: ApiClientService) {}

  public baseUrl: string = '/mobile/custom_orders/weekly';

  public get(date): Observable<any> {
    return this.apiClient.get(this.baseUrl, { date }).map((responseData) => responseData.json());
  }
}
