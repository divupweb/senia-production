import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Pipe({
  name: 'calendarTime'
})

export class CalendarTimePipe implements PipeTransform {

  public constructor(protected translate: TranslateService) {}

  transform(date: string, format: any[] = [], defaulFormat = 'DD/MM/YYYY'): string {
    let momentDate = moment(date);
    let def = {
      sameDay: `[${this.translate.instant('CALENDAR.TODAY')}]`,
      nextDay: `[${this.translate.instant('CALENDAR.TOMORROW')}]`,
      lastDay: `[${this.translate.instant('CALENDAR.YESTERDAY')}]`,
      lastWeek: defaulFormat, nextWeek: defaulFormat, sameElse: defaulFormat
    }

    return moment(momentDate).calendar(null, _.merge(def, format));
  }
}
