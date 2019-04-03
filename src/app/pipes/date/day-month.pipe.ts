import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dayMonth'
})

export class DayMonthPipe implements PipeTransform {
  format = 'DD MMMM';

  transform(value: any, args: any[]) {
    var formatted = "";
    if (!!value) formatted = moment(value).format(this.format);

    return formatted;
  }
}
