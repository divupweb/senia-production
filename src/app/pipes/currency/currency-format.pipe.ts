import { Pipe, PipeTransform } from '@angular/core';
import { AppStateService } from "app/services";
import { TranslateService } from "@ngx-translate/core";
import {CurrencyFract} from "app/pipes/currency";
import {DecimalPipe} from "@angular/common";

@Pipe({
  name: 'currencyFormat'
})

export class CurrencyFormatPipe implements PipeTransform {

  constructor(protected state: AppStateService, protected translate: TranslateService) {}
  transform(value: any, withCode: boolean = false) {
    if (_.isArray(value)) {
      return this.translate.instant('SHARED.COMPONENTS.PRICE_RANGE', {
        from: this.formatValue(value[0]),
        to: this.formatValue(value[1])
      })
    }
    return this.formatValue(value);
  }

  formatValue(value) {
    const currency = this.state.currencyInformation();
    const symbolFirst = _.get(currency, 'symbol_first', false);
    const symbol = _.get(currency, 'symbol', '');
    const cashValue = this.roundToMinimumCashValue(value);
    let currencyValue = ((cashValue as any) % 1 == 0)
      ? parseInt((cashValue as any))
      : new DecimalPipe(this.translate.currentLang).transform(value, this.state.currencyDecimalFormat());
    const withSymbol = [currencyValue, symbol];
    return (symbolFirst ? _.reverse(withSymbol) : withSymbol).join('');
  }

  roundToMinimumCashValue(value): number|string {
    const currency = this.state.currencyInformation();
    const subunitToUnit = _.get(currency, 'subunit_to_unit', 1);
    const smallestDenomination = _.get(currency, 'smallest_denomination', 1);
    if (!isNaN(value)) {
      const subunitValue =  parseFloat(value) * subunitToUnit;
      return (subunitValue - (subunitValue % smallestDenomination) ) / subunitToUnit;
    }
    return value;
  }
}
