import { Injectable} from "@angular/core";
import { ApiClientService } from "app/services";
import {Observable} from "rxjs/Observable";
import {Response} from "@angular/http";

@Injectable()
export class AdminProfileApiService {

  protected baseUrl: string = '/company/profile';
  public constructor(protected api: ApiClientService){}

  public get(): Observable<any> {
    return this.api.get(this.baseUrl).map((r:Response) => r.json())
  }

  public update(params: any): Observable<any> {
    return this.api.put(this.baseUrl, JSON.stringify(params)).map((r:Response) => r.json())
  }
}
