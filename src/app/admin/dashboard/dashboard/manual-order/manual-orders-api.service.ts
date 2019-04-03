import { Response } from '@angular/http';
import {Injectable} from "@angular/core";
import {ApiClientService, ObjectLoader} from "app/services";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ManualOrdersApiService {

  protected baseUrl: string = '/admin/orders';

  public constructor(protected api: ApiClientService) { }

  public getOwners(subscription: string, query: string|null = null): Observable<any> {
    return this.api.get(this.baseUrl + '/owners', { subscription, query }).map((r: Response) => r.json());
  }

  public getDishes(subscription: string, query: string|null = null): Observable<any> {
    return this.api.get(this.baseUrl + '/dishes', { subscription, query }).map((r: Response) => r.json());
  }

  public getOrders(subscription: string, date: any): Observable<any> {
    return this.api.get(this.baseUrl, { subscription, date }).map((r: Response) => r.json());
  }

  public getTotal(params: any): Observable<any> {
    return this.api.post(this.baseUrl + '/total', JSON.stringify(ObjectLoader.toSnakeCase(params)))
      .map((r: Response) => r.json());
  }

  public remove(id: number): Observable<any> {
    return this.api.delete(this.baseUrl + `/${id}`).map((r: Response) => r.json());
  }

  public saveOrder(params: any): Observable<any> {
    return this.api.post(this.baseUrl, JSON.stringify(ObjectLoader.toSnakeCase(params))).map((r: Response) => r.json());
  }

}
