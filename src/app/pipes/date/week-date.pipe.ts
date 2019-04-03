import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Pipe({
  name: 'weekNumber'
})

export class WeekNumberPipe implements PipeTransform {
  constructor(protected translate: TranslateService) {}
  format = `[${this.translate.instant('CALENDAR.W')}].W`;

  transform(value: any, args: any[]) {
    var formatted = "";
    if (!!value) formatted = moment(value).format(this.format);

    return formatted;
  }
}
