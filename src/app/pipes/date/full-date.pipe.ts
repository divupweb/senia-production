import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullDate'
})

export class FullDatePipe implements PipeTransform {
  format = 'dddd Do [of] MMMM';

  transform(value: any, format: string = this.format) {
    if(value) {
      return moment(value).format(format);
    }
  }
}
