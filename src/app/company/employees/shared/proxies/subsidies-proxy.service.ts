import { Injectable } from '@angular/core';
import { CollectionProxy, ToastService } from 'app/services';
import { Observable, Subject } from "rxjs";
import { SubsidyApiService } from "../api-services";

@Injectable()
export class SubsidiesProxyService extends CollectionProxy {
  periods;
  valueTypes;

  constructor(protected apiService: SubsidyApiService, protected toast: ToastService) {
    super(toast);
    this.getAll(true);

    this.createLoader('periods', this.apiService.periods());
    this.createLoader('valueTypes', this.apiService.valueTypes());
  }

  protected loadCollection(): Observable<any> {
    return this.apiService.get()
  }
}
