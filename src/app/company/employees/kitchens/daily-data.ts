import { Injectable, EventEmitter } from '@angular/core';
import {
  CompanyKitchensApiService,
  CompanyDailyKitchensApiService
 } from '../shared/api-services';
import { ToastService } from 'app/services';

@Injectable()
export class DailyData {
  constructor(
    public kitchensApi: CompanyKitchensApiService,
    public dailyKitchensApi: CompanyDailyKitchensApiService,
    public toast: ToastService) { }

  private subscriptionsValue;
  private dailyKitchens;
  companyKitchens;
  private kitchenSubscriptions;
  data = [];
  weekArray = moment.weekdays();
  private load$;

  get subscriptions() {
    return this.subscriptionsValue;
  }

  set subscriptions(value) {
    this.subscriptionsValue = value;
    this.build()
  }

  // Build data
  build() {
    this.clear();
    if (_.isEmpty(this.dailyKitchens) ||
        _.isEmpty(this.subscriptions) ||
        _.isEmpty(this.companyKitchens) ||
        _.isEmpty(this.kitchenSubscriptions)) return;

    for (let i = 0; i <= 4; i++ ) {
      let day = this.initDay(i);
      this.data.push(day);
    }
  }

  private clear() {
    this.data.length = 0;
  }

  private initDay(day) {
    let subscriptions = _(this.subscriptions).map((s) => this.initSubscription(day, s)).value();

    return {
      day: day,
      weekday: this.weekArray[day + 1],
      subscriptions: subscriptions
    }
  }

  private initSubscription(day, subscription) {
    return {
      subscription: subscription,
      dki: this.selectDailiKitchenItems(day, subscription)
    }
  }

  private selectDailiKitchenItems(day, subscription) {
    let dki = this.findDkis(subscription, day);
    return _(dki).map((e) => this.fillKitchen(e)).sortBy(['kitchen.name']).value();
  }

  private findDkis(subscription, day) {
    let dayly: any[] = _(this.dailyKitchens).get(`${subscription.subscription_type}`, []);
    let d = _.find(dayly, { day });
    return _.get(d, 'company_daily_kitchen_items', []);
  }

  private fillKitchen(dkiItem) {
    let item = _.clone(dkiItem);
    let ck = _.find(this.companyKitchens, { id: item.company_kitchen_id});
    item.kitchen = this.findKitchen(ck);
    return item;
  }

  private findKitchen(ck) {
    if (!ck) return;
    let kitchenSubscription = _.find(this.kitchenSubscriptions, {id: ck['kitchen_subscription_id']});
    if (!kitchenSubscription) return;
    return {
      id: kitchenSubscription['kitchen_id'],
      display_url: kitchenSubscription['kitchen_display_url'],
      name: ck['kitchen_name'],
      company_kitchen_id: ck['id'],
      kitchen_subscription_id: ck['kitchen_subscription_id'],
    };
  }
  // End build

  // Add/remove kitchen

  addKitchen(day, subscription, kitchen) {
    let bySubscription = this.getBySubscriptionData(day, subscription);
    if (!bySubscription) return;

    let item = this.findDki(bySubscription.dki, kitchen);
    this.addKitchenDki(bySubscription, item, kitchen)
  }

  private addKitchenDki(bySubscription, item, kitchen) {
    if (!item) {
      let subscription = bySubscription.subscription;
      let ck: any = _.find(this.companyKitchens, { kitchen_id: kitchen.id, company_subscription_id: subscription.id });

      if (!ck) {
        console.error('Company kitchen not found');
        return
      }
      item = {
        company_kitchen_id: ck.id,
        kitchen: kitchen
      };

      bySubscription.dki.push(item);
    } else if (item.hasOwnProperty('_destroy')) {
      delete item._destroy;
    }
    this.updateSubscription(bySubscription);
  }

  removeKitchen(day, subscription, kitchen) {
    let bySubscription = this.getBySubscriptionData(day, subscription);
    if (!bySubscription) return;
    let item = this.findDki(bySubscription.dki, kitchen);
    this.setRemove(bySubscription, item);
  }

  private updateSubscription(bySubscription) {
    bySubscription.dki = bySubscription.dki.slice(); // force update
  }

  private setRemove(bySubscription, item) {
    if (!item) return;
    if (item.id) {
      item._destroy = 1
    } else {
      _.remove(bySubscription.dki, item);
    }
    this.updateSubscription(bySubscription);
  };

  private getBySubscriptionData(day, subscription): any {
    let byDay  = this.data[day];
    if (!byDay) return;
    return _.find(byDay.subscriptions, { subscription : {subscription_type: subscription }})
  }

  private findDki(dki, kitchen): any {
    return _.find(dki, { kitchen: { id: kitchen.id }});
  }

  // Kitchen's active days grouped by subscription
  activeDays(kitchen) {
    if (!kitchen) return {};

    let days = {};
    _.each(this.data, (byDay) => {
      _.each(byDay.subscriptions, (s) => {
        let type = s.subscription.subscription_type;
        _.each(s.dki, (dki) => {
          if ((dki.kitchen.id == kitchen.id) && (dki._destroy != 1)) {
            if (!days[type]) days[type] = [];
            days[type].push(byDay.day);
          }
        });
      });
    });

    return days;
  }

  // Loading
  load() {
    this.load$ = new EventEmitter();
    this.loadKitchenSubscriptions();
    this.loadDailyKitchens();
    return this.load$;
  }

  private loadFlat(items) {
    return _(items).values().flatten().value();
  }

  loadKitchenSubscriptions() {
    this.kitchenSubscriptions = [];
    this.companyKitchens = [];
    this.kitchensApi.getList().subscribe(
      (response) => {
        this.kitchenSubscriptions = this.loadFlat(response.kitchen_subscriptions);
        this.companyKitchens = this.loadFlat(response.company_kitchens);
        this.build();
        this.load$.emit({ kitchenSubscriptions: true, companyKitchens: true })
      },
      (error) => this.toast.error(error)
    )
  }

  loadDailyKitchens() {
    this.dailyKitchens = {};
    this.dailyKitchensApi.getList().subscribe(
      (dailyKitchens) => {
        this.dailyKitchens = dailyKitchens;
        this.build();
        this.load$.emit({ dailyKitchens: true })
      },
      (error) => this.toast.error(error)
    )
  }

  params() {
    if (!this.subscriptions) return [];
    let updateData = this.subscriptions.map((subscription)=> {
      return {
        id: subscription.id,
        type: subscription.type,
        active: false,
        company_daily_kitchens_attributes: []
      };
    });

    _.each(this.data, (e, i) => {
      _.each(e.subscriptions, (s) => {
        let dataItem: any = _.find(updateData, { type: s.subscription.type });
        let dataDailyKitchen: any = _.find(dataItem.company_daily_kitchens_attributes, { day: i });
        if (!dataDailyKitchen && s.dki.length > 0) {
          const cdk  = _.chain(this.dailyKitchens).get(`${s.subscription.subscription_type}`, []).find({ day: i }).value();
          dataDailyKitchen = _.merge({
            day: i,
            id: null,
            _destroy: 1,
            company_daily_kitchen_items_attributes: []
          }, _.pick(cdk, 'id'));
          dataItem.company_daily_kitchens_attributes.push(dataDailyKitchen);
        }
        _.each(s.dki, (dkItem: any) => {
          let item = _.pick(dkItem, ['id', 'company_kitchen_id', '_destroy']);
          if (dkItem.company_daily_kitchen_id && !dataDailyKitchen.id) dataDailyKitchen.id = dkItem.company_daily_kitchen_id;
          dataDailyKitchen.company_daily_kitchen_items_attributes.push(item);
        })
      })
    });

    // fill active/destroy
    _.each(updateData, (subscription) => {
      let active = false;
      _.each(subscription.company_daily_kitchens_attributes, (cdk) => {
        let activeCdk = cdk.company_daily_kitchen_items_attributes.some((cdkItem) => {
          return cdkItem._destroy != 1;
        });
        if (activeCdk) {
          active = true;
          delete cdk._destroy;
        }
      });
      subscription.active = active;
    });

    return updateData;
  }

}
