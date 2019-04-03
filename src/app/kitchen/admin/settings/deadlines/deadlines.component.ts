import {Component, OnInit, ViewChild} from "@angular/core";
import { KitchenSubscriptionProxy } from "app/kitchen/shared/proxy/";
import { KitchenDeadlinesApiService } from "app/kitchen/services/";
import { Observable } from "rxjs";
import {AccountsProxy, ToastService} from "app/services/";
import { DeadlineFormComponent } from "./form/";


@Component({
  selector: 'kitchen-deadlines',
  styleUrls: ['./deadlines.scss'],
  templateUrl: 'deadlines.html'
})
export class DeadlinesComponent {

  @ViewChild('form')
  public form: DeadlineFormComponent;
  public subscriptions: any[] = [];
  public deadlines: any = {};
  public weekDays: string[] = moment.weekdays();
  public weekDaysShort: string[] = moment.weekdaysMin();

  public constructor(protected subscriptionService: KitchenSubscriptionProxy,
                     protected deadlinesApi: KitchenDeadlinesApiService,
                     protected toast: ToastService) {
    this.weekDaysShort.push(this.weekDaysShort.shift());
    this.weekDays.push(this.weekDays.shift());
    this.subscriptionService.getAll().subscribe((data) => {
      this.subscriptions = data;
      const observableChain = _.map(this.subscriptions, (s) => {
        this.deadlines[s.subscription_type] = [];
        return this.deadlinesApi.getAll(s.subscription_type);
      });
      Observable.forkJoin(observableChain).subscribe((results) => {
        _.each(_.flatten(results), (regionalDeadlines) => {
          _.each(regionalDeadlines, (deadline) => {
            _.set(this.deadlines, [deadline.subscription_type, deadline.account_id, deadline.day], new Deadline(deadline))
          });
        });
      }, (e) => this.toast.error(e));
    });
  }


  public formSubmitted(deadline): void {
    let d = _.get(this.deadlines, [deadline.subscription_type, deadline.account_id, deadline.day]);
    _.merge(d, new Deadline(deadline));
  }

}

class Deadline {
  private timeFormat = 'HH:mm';
  constructor(json) {
    Object.assign(this, json);
    ["closing_time", "pickup_time"].forEach((e) => {
      this[e] = moment(json[e], this.timeFormat);
    })
  }
}
