import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Duration } from "moment";

@Pipe({
  name: 'duration'
})

export class DurationPipe implements PipeTransform {
  constructor(protected translate: TranslateService) {}

  protected minutesLabel: string = 'CALENDAR.SHORT_MINUTES';
  protected hoursLabel: string   = 'CALENDAR.SHORT_HOURS';
  protected daysLabel: string    = 'CALENDAR.SHORT_DAYS';
  transform(value: Duration): string {
    return this.humanize(value)
  }

  protected humanize(duration): string {
    const minutes = duration.minutes();
    const hours = duration.hours();
    const days = duration.days();

    let msg;
    this.translate.get(this.minutesLabel).subscribe((res: string) => {
      msg = minutes + this.translate.instant(this.minutesLabel);
    });
    if (hours > 0) {
      this.translate.get(this.hoursLabel).subscribe((res: string) => {
        msg = `${hours}${this.translate.instant(this.hoursLabel)} ${msg}`;
      });
    }
    if (days > 0) {
      this.translate.get(this.daysLabel).subscribe((res: string) => {
        msg = `${hours}${this.translate.instant(this.daysLabel)} ${msg}`;
      });
    }
    return msg;
  }
}
