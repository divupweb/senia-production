import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'weekDay'
})

export class ShortWeekDayPipe implements PipeTransform {
  format = 'dd DD.MM';

  transform(value: any, args: any[]) {
    var formatted = "";
    if (!!value) formatted = moment(value).format(this.format);

    return formatted;
  }
}
