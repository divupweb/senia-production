import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { ToastService } from 'app/services';
import { PeriodicOrdersApiService } from './periodic-orders-api.service';

@Injectable()
export class PeriodicOptions {
  data = {};
  loader = {};

  constructor(
    private api: PeriodicOrdersApiService,
    private toast: ToastService) {}

  load(day, subscriptions) {
    let observer;
    if (this.data.hasOwnProperty(day)) {
      observer = Observable.from([this.data[day]])
    } else if (this.loader[day]) {
      observer = this.loader[day];
    } else {
      observer = this.loadDay(day, subscriptions)
    }
    return observer;
  }

  private loadDay(day, subscriptions) {
    let subject = new Subject();
    let observer = subject.asObservable();
    let counter = 0;

    this.loader[day] = observer;

    let checkFinish = ((i, s, data) => {
      counter += 1;
      this.mergeSubscription(i, s, data);
      if (counter < subscriptions.length) return;
      subject.next(this.data[i]);
      subject.complete();
      delete this.loader[i];
    }).bind(this);

    _.each(subscriptions, (s) => {
      this.api.options(s, day).subscribe(
        (data) => {
          checkFinish(day, s, data);
        },
        (error) => {
          console.error(`Unable to load ${s}`);
          checkFinish(day, s, []);
        }
      )
    });
    return observer;
  }

  private mergeSubscription(day, s, data) {
    if (!this.data.hasOwnProperty(day)) this.data[day] = {};
    this.data[day][s] = data;
  }

  private loadOptions(subscriptions, data) {
    let dayData = {};
    _.each(subscriptions, (s, i) => {
      dayData[s] = data[i];
    });
    return dayData;
  }
}
