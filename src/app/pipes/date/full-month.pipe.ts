import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'fullMonth'
})

export class FullMonthPipe implements PipeTransform {
  format = 'MMMM YYYY';

  transform(value: any, args: any[]) {
    var formatted = "";
    if (!!value) formatted = moment(value).format(this.format);

    return formatted;
  }
}
