import { Component, ViewChild } from '@angular/core';
import { DailyData } from './daily-data';
import { SubsidiesData } from '../shared';
import {
  SubsidyApiService,
  CompanyKitchensApiService,
  CompanyDailyKitchensApiService,
  EmployeesOrdersApiService
} from '../shared/api-services';
import {
  CompanySubscriptionsApiService,
  FavoriteKitchensService,
  MenuApiService,
  Kitchen
} from '../../shared';
import { ToastService, WindowRef } from 'app/services';
import { SubscriptionsProxyService } from "app/company/employees/shared/proxies";
import { Observable } from 'rxjs';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'kitchens',
  providers: [
    SubsidyApiService,
    MenuApiService,
    CompanySubscriptionsApiService,
    CompanyKitchensApiService,
    CompanyDailyKitchensApiService,
    FavoriteKitchensService,
    EmployeesOrdersApiService,
    SubsidiesData,
    DailyData
  ],
  styleUrls: ['kitchens.scss'],
  templateUrl: './kitchens.html'
})

export class KitchensComponent  {
  kitchens = {};
  subscriptions = [];
  showkitchenPopup = false;
  selectedKitchen;
  window: any = {};
  @ViewChild('confirmation') confirmation;
  @ViewChild('confirmationOnLeave') confirmationOnLeave;
  public isFormDirty: boolean = false;

  protected initSubsidyParams: any = {};
  protected initDaylyParams: any = {};
  constructor(public menuApi: MenuApiService,
              public favoriteKitchensApi: FavoriteKitchensService,
              public employeesOrdersApi: EmployeesOrdersApiService,
              public subsidies: SubsidiesData,
              public dailyData: DailyData,
              public toast: ToastService,
              public subscriptionsProxy: SubscriptionsProxyService,
              protected translate: TranslateService) {
    this.window = WindowRef.nativeWindow;
  }

  canDeactivate() {
    return Observable.create((observer) => {
      if (this.isFormDirty) {
        this.confirmationOnLeave.show().subscribe((value) => {
          this.confirmationOnLeave.modal.onHidden.subscribe(() => {
            observer.next(value);
            observer.complete();
          });
        });
      } else {
        observer.next(true);
        observer.complete();
      }
      this.window.onbeforeunload = null;
    });
  }

  ngOnInit() {
    this.loadSubscriptions();
    this.loadKitchens();
    this.load();
  }

  private load() {
    this.subsidies.load(true).subscribe(() => this.initSubsidyParams = this.subsidies.params());

    this.dailyData.load().subscribe(
      (resp) => {
        this.initDaylyParams = this.dailyData.params();
        if (resp.dailyKitchens == true) this.fillCompanyKitchens();
      }
    );
  }

  formChange() {
    setTimeout(() => {
      this.isFormDirty = !_.isEqual(
        [this.initSubsidyParams, this.initDaylyParams],
        [this.subsidies.params(), this.dailyData.params()]
      );
      this.window.onbeforeunload = this.isFormDirty ? () => true : null;
    })
  }

  loadKitchens() {
    this.menuApi.kitchens().subscribe(
      (data) => {
        this.kitchens = Kitchen.load(data.kitchens, this.favoriteKitchensApi, this.toast, this.translate);
        this.fillCompanyKitchens();
      },
      (error) => this.toast.error(error)
    )
  }

  private fillCompanyKitchens() {
    if (_.isEmpty(this.kitchens) || _.isEmpty(this.dailyData.companyKitchens)) return;
    Kitchen.fillCompanyKitchens(this.kitchens, this.dailyData.companyKitchens);
  }

  loadSubscriptions() {
    let subscriptionsWithoutActive = (data) => _.map(data, (d) => _.omit(d, 'active'));

    this.subscriptionsProxy.getAll().subscribe(
      (data) => {
        let subscriptions = subscriptionsWithoutActive(data);
        this.subscriptions = this.defaultSubscriptions(subscriptions);
        this.dailyData.subscriptions = this.subscriptions;
      },
      (error) => this.toast.error(error)
    )
  }

  private defaultSubscriptions(data) {
    let def = (type, i) => {
      return {
        id: null,
        type: `${_.upperFirst(type)}CompanySubscription`,
        active: true,
        subscription_type: type,
        subscription_code: i
      }
    };
    let subscriptions = ['breakfast', 'lunch', 'dinner'];
    let items = _(data.concat(subscriptions.map(def))).uniqBy('subscription_type')
                                                 .filter((e: any) => -1 < subscriptions.indexOf(e.subscription_type))
                                                 .sortBy(['subscription_code'])
                                                 .value();
    items.forEach((e: any) => { e.selectActive = true });
    return items;
  }

  onSelect(item) {
    this.selectedKitchen = item;
    this.showkitchenPopup = true;
  }

  onPopupClose() {
    this.selectedKitchen = null;
    this.showkitchenPopup = false;
  }

  activeDays() {
    return this.dailyData.activeDays(this.selectedKitchen);
  }

  onPopupAdd(item) {
    this.onPopupClose();
    this.addKitchen(item.kitchen, item.calendar);
    this.formChange();
  }

  save() {
    this.confirmation.show().subscribe(
      (resp) => {
        if (!resp) return;
        let subsidies: any = this.subsidies.params();
        let daily: any = this.dailyData.params();

        this.employeesOrdersApi.put(subsidies, daily).subscribe(
          () => {
            this.load();
            this.toast.success(this.translate.instant('TOAST.SUCCESS.SUBSIDIES_UPDATED'));
            this.subscriptionsProxy.getAll(true);
            this.resetFormState()
          },
          (error) => this.toast.error(error)
        )
      });
  }

  addKitchen(kitchen, calendar) {
    _.each(calendar, (s) => {
      _.each(s.days, (v, day) => {
        let method = v ? 'addKitchen' : 'removeKitchen';
        this.dailyData[method](day, s.type, kitchen)
      })
    })
  }

  protected resetFormState(): void {
    this.isFormDirty = false;
    this.window.onbeforeunload = null;
  }

}
