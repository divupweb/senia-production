import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyNokHtml'
})

export class CurrencyNokHtmlPipe implements PipeTransform {

  transform(value: any, args: any[]) {
    if(_.isArray(value)) {
      return (this.formatValue(value[0]) + "<span style=\"font-size: 18px; color: #9b9b9b;\"> to </span>" + this.formatValue(value[1]));
    } else {
      return this.formatValue(value);
    }
  }

  formatValue(value) {
    if(!isNaN(value)) {
      return parseInt(value) + ',-';
    } else {
      return value;
    }
  }
}
