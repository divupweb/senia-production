import { Injectable } from '@angular/core';
import { CompanySubscriptionsApiService } from 'app/company/shared';
import {CollectionProxy, ToastService} from 'app/services';
import { Observable } from "rxjs";

@Injectable()
export class SubscriptionsProxyService extends CollectionProxy {

  public subscriptions = {};

  constructor(protected api: CompanySubscriptionsApiService, protected toast: ToastService) {
    super(toast);
    this.getAll(true);
  }

  protected handleResponse(data) {
    this.subscriptions = _.mapKeys(data, 'subscription_type');
    return data;
  }

  protected loadCollection(): Observable<any> {
    return this.api.getList();
  }
}
