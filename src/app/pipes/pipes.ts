import * as datePipes from './date';
import * as customPipes from './custom';
import * as currencyPipes from './currency';

const DatePipes: any[] = _(datePipes).values().flattenDeep().value();
const CurrencyPipes: any[] = _(currencyPipes).values().flattenDeep().value();
const CustomPipes: any[] = _(customPipes).values().flattenDeep().value();


export const PIPES = [
  ...DatePipes,
  ...CurrencyPipes,
  ...CustomPipes
]
