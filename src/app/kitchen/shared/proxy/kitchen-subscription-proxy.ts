import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CollectionProxy, ToastService } from "app/services/";
import { KitchenSubscriptionsApiService } from 'app/kitchen/services/'

@Injectable()
export class KitchenSubscriptionProxy extends CollectionProxy {

  public constructor(protected api: KitchenSubscriptionsApiService, toast: ToastService ) {
    super(toast);
  }

  protected loadCollection(): Observable<any> {
    return this.api.get();
  }
}
