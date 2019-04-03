import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from "@angular/common";

@Pipe({
  name: 'currencyFract'
})

export class CurrencyFract extends DecimalPipe implements PipeTransform {
  public transform(value: any, digits: string = this.defaultFormat()): string {
    return super.transform(value, digits);
  }

  private defaultFormat(): string {
    return '1.2-2'
  }
}
