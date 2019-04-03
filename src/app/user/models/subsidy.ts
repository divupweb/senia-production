import { TranslateService } from "@ngx-translate/core";
import { ObjectLoader } from 'app/services';
import { CurrencyFormatPipe } from 'app/pipes/currency';

export class Subsidy {
  free = false;
  value = 0;
  active = false;
  valueType;
  period;
  subscriptionType;
  accumulated = 0;

  constructor(json, private t: TranslateService, private currencyFormat: CurrencyFormatPipe) {
    Object.assign(this, ObjectLoader.toCamelCase(json))
  }

  get representation() {
    let value;

    if (!this.active) return value;
    if (this.free) {
      value = this.t.instant('SUBSIDIES.FREE');
    } else {
      if (this.valueType == 'amount') {
        let period = this.t.instant(`SUBSIDIES.PERIODS.${this.period}`.toUpperCase());
        let currency = this.currencyFormat.transform(this.value);
        value = `${currency} ${period}`;
      } else { // percentage
        value = `${this.value} %`;
      }
    }

    return value;
  }

  enabled() {
    return this.active && (this.free || this.value > 0);
  }

  get subsidyType() {
    return this.subscriptionType;
  }

  calculate(price) {
    if (this.free || !price) return 0;
    let value = 0;
    switch(this.valueType) {
    case 'amount':
      value = this.calculateAmount(price)
      break;
    case 'percentage':
      value = this.calculatePercentage(price)
      break;
    }

    return value;
  }

  calculateAmount(price) {
    let left = this.value - this.accumulated;
    let value = Math.max(price - left, 0);
    return value;
  }

  calculatePercentage(price) {
    return price - (price * this.value / 100);
  }
}
