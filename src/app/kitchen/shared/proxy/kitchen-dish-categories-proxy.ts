import { CollectionProxy, ToastService } from "../../../services/";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { DishCategoriesApiService } from "../../services/";

@Injectable()
export class KitchenDishCategoriesProxy extends CollectionProxy {

  public constructor(protected api: DishCategoriesApiService, toast: ToastService ) {
    super(toast);
  }

  protected loadCollection(): Observable<any> {
    return this.api.getList();
  }
}
