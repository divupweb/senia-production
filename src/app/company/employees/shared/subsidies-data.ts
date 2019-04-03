import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { ToastService, AppStateService } from 'app/services';
import { SubsidiesProxyService } from "../shared/proxies/subsidies-proxy.service";
import { Observable } from "rxjs";
import { Subsidy } from 'app/company/models'

@Injectable()
export class SubsidiesData {
  data = [];

  constructor(
    public subsidyProxy: SubsidiesProxyService,
    public toast: ToastService,
    private t: TranslateService,
    private state: AppStateService) { }


  load(force: boolean = false) {
    return Observable.create(subject =>
      this.subsidyProxy.getAll(force).subscribe(
        (data) => {
          this.data = this.defaultSubsidies(data).map((s) => this.createSubsidy(s));
          subject.next(this.data);
        })
    );
  }

  private defaultSubsidies(data) {
    let def = (type) => {
      return {
        type: `${_.upperFirst(type)}Subsidy`,
        active: true,
        value: 0,
        subscription_type: type,
        id: null,
        free: false,
        period: null,
        value_type: null
      }
    };
    let subscriptions = ['breakfast', 'lunch', 'dinner'];
    return _(data.concat(subscriptions.map(def))).uniqBy('subscription_type')
                                                 .value();
  }

  params() {
    return this.data.map((e) => e.params());
  }

  private createSubsidy(json) {
    return new Subsidy(
      json,
      this.t,
      this.subsidyProxy.valueTypes(),
      this.subsidyProxy.periods(),
      this.state
    );
  }
}
