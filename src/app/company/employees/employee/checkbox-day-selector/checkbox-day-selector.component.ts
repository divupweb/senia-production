import { Component, Input } from '@angular/core';


@Component({
  selector: 'checkbox-day-selector',
  templateUrl: './checkbox-day-selector.html',
  styleUrls: ['checkbox-day-selector.scss'],
})

export class CheckboxDaySelectorComponent {

  @Input()
  public allowedDays: number[];

  @Input()
  public employeeSubscription: any;

  public days: string[] = [];

  public ngOnInit(): void {
    this.days = _.slice(moment.weekdaysMin(), 1, 6);
  }
  public dayDisabled(index): boolean {
    return !_.includes(this.allowedDays, index);
  }

  public dayChecked(index): boolean {
    return _.chain(this.employeeSubscription).get('days', []).includes(index).value();
  }

  public changeDay(index: number, event): void {
    if (event.target.checked) {
      this.employeeSubscription.days.push(index);
    } else {
      _.remove(this.employeeSubscription.days, (d) => (d == index));
    }
  }
}
