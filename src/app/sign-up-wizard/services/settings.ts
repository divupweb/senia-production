import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { AppStateService, ToastService, ObjectLoader } from 'app/services';
import { UserSettingsApiService } from 'app/user/services';
import { SignUpWizardApiService } from './sign-up-wizard-api.service';
import {TranslateService} from "@ngx-translate/core";

const FREE = 'free';

@Injectable()
export class Settings {
  company = {};
  subscriptions = [];
  preferences = [];
  free = false;
  user: any = {};
  private subsidies = [];

  // params
  preferenceId;
  allergyIds = [];
  sorting = 'asc';
  notifications = false;


  constructor(
    private userSettings: UserSettingsApiService,
    private signUpApi: SignUpWizardApiService,
    private state: AppStateService,
    private toast: ToastService,
    protected translate: TranslateService) {}

  // Loading
  load() {
    this.loadWizardInfo();
  }

  private loadWizardInfo() {
    this.signUpApi.get().subscribe(
      (data) => {
        let fields = ['company', 'user'];
        Object.assign(this, _.pick(data, fields));

        this.loadSubscriptions(data.subscriptions);
        this.loadPreferences(data.preferences);
      },
      (error) => {
        this.toast.error(error)
      }
    )
  }

  private loadSubscriptions(subscriptions) {
    let order = ['breakfast', 'lunch', 'dinner'];
    let list = _.orderBy(subscriptions, (s) => order.indexOf(s.subscription_type));

    this.free = true;
    _.each(list, (s) => {
      let subsidy = _.find(this.user.active_subsidies, { subscription_type: s.subscription_type });
      let value: any = 0;
      if (subsidy) value = subsidy.free ? FREE : subsidy.value;
      s.subsidy = value;
      this.free = this.free && value == FREE;
    });
    this.subscriptions = list;
  }

  private loadPreferences(preferences) {
    let def = [{ id: null, name: this.translate.instant('SIGN_UP.SHOW_ME_ANYTHING') }];
    this.preferences = def.concat(preferences);
  }

  toggleNotifications() {
    this.notifications = !this.notifications;
  }

  save() {
    return Observable.create((observer) => {
      this.signUpApi.put(this.params).subscribe(
        (data) => {
          this.toast.success(this.translate.instant('TOAST.SUCCESS.PREFERENCES_UPDATED'));
          this.state.set('current', data.user);
          observer.next(data);
          observer.complete();
        },
        (data) => {
          this.toast.error(data);
          observer.error(data);
          observer.complete();
        }
      )
    });
  }


  get params() {
    let params = {
      employee_settings_attributes: { sorting: this.sorting }
    };
    let data = _.pick(this, ['preferenceId', 'allergyIds', 'notifications']);
    Object.assign(params, ObjectLoader.toSnakeCase(data));
    return params;
  }
}
