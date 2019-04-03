import { Pipe, PipeTransform } from '@angular/core';
import { AppStateService } from "app/services";

@Pipe({
  name: 'currencyCode'
})

export class CurrencyCodePipe implements PipeTransform {

  protected separator: string = ' ';

  constructor(protected state: AppStateService) {}
  public transform(value: string): string {
    let withCode = [value, this.state.currentCurrencyCode()];
    return _.join(withCode, this.separator);
  }
}
