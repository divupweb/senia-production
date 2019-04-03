import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { ApiClientService } from '../../../services';

@Injectable()
export class CompanyReportApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/company/order_reports/';

  getWeekData(subscription, weekStart, daysCount = 5) {
    return this.apiClient.get(this.baseUrl + subscription, { week_start: weekStart, days: daysCount}).map(data => data.json());
  }

  public getCustomReport(params: any): Observable<any> {
    return this.apiClient.post(this.baseUrl + 'custom', JSON.stringify(params)).map(data => data.json());
  }

  public getCustomReportFile(params: any): Observable<any> {
    return this.apiClient.post(this.baseUrl + 'custom/pdf', JSON.stringify(params)).map(data => data.json());
  }
}
