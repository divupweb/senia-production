import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KitchenDeadlinesApiService } from "app/kitchen/services/";
import { ToastService } from "app/services/";

@Component({
  selector: 'deadline-form',
  templateUrl: './deadline-form.html',
  styleUrls: ['./deadline-form.scss']
})

export class DeadlineFormComponent {
  public state: boolean = false;

  @Input()
  public deadline: any = {};

  @Input()
  public weekDaysShort: string[];

  @Input()
  public weekDays: string[];

  @Output()
  public onSubmit: EventEmitter<any> = new EventEmitter();

  public pickupTime;
  public closingTime;
  public closingDay: number;
  protected timeFormat = 'HH:mm';

  public constructor(protected api: KitchenDeadlinesApiService,
                     protected toast: ToastService) {}

  public show(deadline): void {
    this.deadline = deadline;
    this.closingDay = _.toInteger(deadline.closing_day);
    this.setTime();
    this.state = true;
  }

  public submit(): void {
    let f = (d) => moment.parseDate(d).format(this.timeFormat);
    let params = _.clone(this.deadline);
    this.api.put(_.merge(params, {
      closing_day: this.closingDay,
      subscription: params['subscription_type'],
      pickup_time: f(this.pickupTime),
      closing_time: f(this.closingTime),
    })).subscribe((deadline) => {
      this.deadline = deadline;
      this.onSubmit.next(deadline);
      this.close();
    }, (e) => this.toast.error(e));
  }

  public close(): void {
    this.state = false;
    this.deadline = {};
  }

  protected setTime(): void {
    ["closing_time", "pickup_time"].forEach((e) => {
      let time = this.deadline[e];
      this[_.camelCase(e)] = time.toDateTZ();
    });
  }
}
