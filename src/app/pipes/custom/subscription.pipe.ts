import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Pipe({
  name: 'subscription'
})
export class SubscriptionPipe implements PipeTransform {
  constructor(private t: TranslateService) {}

  transform(value: any, args?: any): any {
    let str = '';
    let type;
    let getType = (value, keys) => {
      let type;
      keys.some((k) => {
        if (value.hasOwnProperty(k))  {
          type = value[k];
          return true;
        }
      })
      return type;
    }
    if (!!value) {
      let keys = ['subscriptionType', 'subsidyType'];
      type = getType(value, keys);
      if (!type) type = getType(value, keys.map(_.snakeCase));
      if (!type) type = _.toString(value);
    }
    if (type) str = this.t.instant('SUBSCRIPTIONS.' + _.upperCase(type))

    return str;
  }

}
