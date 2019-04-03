import { Injectable } from '@angular/core';
import { ApiClientService } from '../../services';
import { Observable } from "rxjs";

@Injectable()
export class SuspendPeriodsService {
  constructor(public apiClient: ApiClientService) {}

  protected baseUrl: string = '/user/suspend_periods/';

  public getOrderDates(date: string): Observable<any> {
    return this.apiClient.get(this.baseUrl + 'dates', {start_date: date}).map((responseData) => responseData.json());
  }

  public get(date: string): Observable<any> {
    return this.apiClient.get(this.baseUrl, {start_date: date}).map((responseData) => responseData.json());
  }

  public create(startDate: string, endDate: string): Observable<any> {
    return this.apiClient.post(this.baseUrl, this.dates(startDate, endDate)).map((responseData) => responseData.json());
  }

  delete(startDate, endDate) {
    return this.apiClient.delete(this.baseUrl + '?start_date=' + startDate + '&end_date=' + endDate).map(responseData => responseData.json())
  }

  private dates(startDate: string, endDate: string): string {
    return JSON.stringify({
      start_date: startDate,
      end_date: endDate
    });
  }
}
