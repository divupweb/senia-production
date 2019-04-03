import { Injectable } from '@angular/core';
import { ApiClientService } from '../../../services';
import { Observable } from "rxjs";

@Injectable()
export class ReportApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl = '/mobile/reports/';

  public get(date: string): Observable<any> {
    return this.apiClient.get(this.baseUrl, { date } ).map((responseData) => responseData.json());
  }

}
