import { Injectable } from '@angular/core';
import { ApiClientService } from 'app/services';
import { Observable } from "rxjs/Observable";
import { Response } from "@angular/http";


@Injectable()
export class ContactApiService {

  protected url: string = '/contact';

  constructor(protected api: ApiClientService) { }

  public submit(data: any): Observable<any> {
    return this.api.post(this.url, JSON.stringify(data)).map((r: Response) => r.json());
  }

}
