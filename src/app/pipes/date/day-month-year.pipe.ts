import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dayMonthYear'
})

export class DayMonthYearPipe implements PipeTransform {
  format = 'D MMMM YYYY';

  transform(value: any, args: any[]) {
    var formatted = "";
    if (!!value) formatted = moment(value).format(this.format);

    return formatted;
  }
}
