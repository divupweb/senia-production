import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortDateTime'
})

export class ShortDateTimePipe implements PipeTransform {

  format = 'DD MMM HH:mm';
  transform(value: any, parceFormat = moment.ISO_8601) {
    let formatted = "";
    if (!!value) formatted = moment(value, parceFormat).format(this.format);

    return formatted;
  }
}
