import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortTime'
})

export class ShortTimePipe implements PipeTransform {

  protected outputFormat = 'HH:mm';
  transform(value: any, format = moment.ISO_8601) {
    let formatted = "";
    if (!!value) formatted = moment(value, format).format(this.outputFormat);

    return formatted;
  }
}
