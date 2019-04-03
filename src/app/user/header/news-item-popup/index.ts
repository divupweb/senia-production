import { NewsItemPopoverComponent } from './news-item-popover.component';
import * as pp from './popups';
let popups = _.values(pp);

export let components = [
  NewsItemPopoverComponent,
  ...popups
]
