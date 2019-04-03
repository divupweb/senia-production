import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CollectionProxy } from './collection-proxy';
import { ToastService } from "./toast";
import { AccountsApiService } from "./accounts-api.service";

@Injectable()
export class AccountsProxy extends CollectionProxy {

  public constructor(protected api: AccountsApiService, toast: ToastService) {
    super(toast);
  }

  protected loadCollection(): Observable<any> {
    return this.api.autocomplete();
  }

  public info() {
    return this.api.info();
  }
}
