import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'month'
})

export class MonthPipe implements PipeTransform {
  format = 'MMMM';

  transform(value: any, args: any[]) {
    let formatted = "";
    if (!!value) formatted = moment(value).format(this.format);

    return formatted;
  }
}
