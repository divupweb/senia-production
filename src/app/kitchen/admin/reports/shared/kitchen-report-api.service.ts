import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { AppUrlsService, ApiClientService } from "../../../../services/";

@Injectable()
export class KitchenReportApiService {
  constructor(protected apiClient: ApiClientService, protected appUrls: AppUrlsService) {}

  public baseUrl: string = `${this.appUrls.kitchenRoot()}/admin/reports/`;

  public getWeekData(subscription, weekStart, daysCount = 5): Observable<any> {
    return this.apiClient.get(`${this.baseUrl}weekly`, { week_start: weekStart, subscription, days: daysCount }).map((data) => data.json());
  }

  public getSummaryData(subscription: string, startDate: string, endDate: string): Observable<any> {
    return this.apiClient.get(`${this.baseUrl}summary`, { start_date: startDate, end_date: endDate, subscription }).map((data) => data.json());
  }

  public getCustomReport(params: any): Observable<any> {
    return this.apiClient.post(this.baseUrl + 'custom', JSON.stringify(params)).map((data) => data.json());
  }

  public getCustomReportFile(params: any): Observable<any> {
    return this.apiClient.post(this.baseUrl + 'custom/pdf', JSON.stringify(params)).map((data) => data.json());
  }
}
