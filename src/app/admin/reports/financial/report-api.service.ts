import {Injectable} from "@angular/core";
import { ObjectLoader} from "app/services";
import {Observable} from "rxjs/Observable";
import * as SuperAdmin from "app/super-admin/reports/financial/report-api.service"

@Injectable()
export class ReportApiService extends SuperAdmin.ReportApiService {
  protected baseUrl: string = '/admin/reports/financial';
  public getGeneral(params: { date: { start: any, end: any } }): Observable<any> {
    return this.api.post(`${this.baseUrl}/general`, JSON.stringify(ObjectLoader.toSnakeCase(params))).map(ObjectLoader.json);
  }
}
