import { Injectable, EventEmitter } from '@angular/core';
import { FavoriteKitchensService } from './favorite-kitchens.service';
import { ToastService } from 'app/services';
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class Kitchen {
  static load(kitchens, favoriteKitchensApi, toast: ToastService, translate: TranslateService): any {
    let object;
    let initKitchen = (v) => new Kitchen(favoriteKitchensApi, toast, translate, v);
    let loadArray = (list) => list.map(initKitchen);

    if (_.isArray(kitchens)) {
      object = loadArray(kitchens);
    } else {
      //hash
      object = {};
      _.each(kitchens, (v, k) => object[k] = loadArray(v));
    }

    return object;
  }

  static fillCompanyKitchens(kitchens, company_kitchens) {
    _.each(kitchens, (items) => {
      _.each(items, k => k.company_kitchens = company_kitchens)
    })
  }

  id;
  favorite = false;
  name = '';
  kitchen_subscriptions: any = [];
  company_kitchens = [];
  rating;
  rating_for_company;
  constructor(
    public favoriteKitchensApi: FavoriteKitchensService,
    public toast: ToastService,
    protected translate: TranslateService,
    object = null) {
      if (object) this.load(object)
  }

  load(object) {
    Object.assign(this, object);
  }


  setFavorite() {
    var observer;
    var value = this.favorite;
    if (value) observer = this.favoriteKitchensApi.remove(this.id)
    else observer = this.favoriteKitchensApi.add(this.id)

    var event = new EventEmitter;
    observer.subscribe(
      data => {
        this.favorite = !value;
        event.emit(data);
        event.complete();
      },
      error => {
        this.toast.error(error)
        event.error(error);
      }
    )

    return event;
  }


  get subscriptions(): any {
    return _(this.kitchen_subscriptions).filter({ active: true }).map('subscription_type').value();
  }

  get info() {
    return _(this.subscriptions).map((s: string) => this.translate.instant(`SUBSCRIPTIONS.${s.toUpperCase()}`)).join(', ');
  }

  private activeCompanySubscriptionIds() {
    return _(this.company_kitchens).filter({ kitchen_id: this.id }).map('kitchen_subscription_id').value();
  }

  private companySubscriptionsValue;
  get companySubscriptions() {
    if (!this.companySubscriptionsValue) {
      let ids = this.activeCompanySubscriptionIds();
      this.companySubscriptionsValue = _(this.kitchen_subscriptions).filter(e => {
        return e.active == true && -1 < ids.indexOf(e.id);
      }).map('subscription_type').value();
    }
    return this.companySubscriptionsValue;
  }
}
