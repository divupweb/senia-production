import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ApiClientService, ObjectLoader} from "app/services";

@Injectable()
export class ReportApiService {

  protected baseUrl: string = '/super/reports/financial';

  public constructor(protected api: ApiClientService) {}

  public getDetail(params: any): Observable<any> {
    return this.api.post( `${this.baseUrl}/detail`, JSON.stringify(ObjectLoader.toSnakeCase(params))).map(ObjectLoader.json);
  }

  public download(params: any): Observable<any> {
    return this.api.post( `${this.baseUrl}/download`, JSON.stringify(ObjectLoader.toSnakeCase(params))).map(ObjectLoader.json);
  }

}
