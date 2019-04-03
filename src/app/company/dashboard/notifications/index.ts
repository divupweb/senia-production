import { NotificationsComponent } from './notifications.component';

import * as items from './kinds';
let kinds = _.values(items);

export let components = [
  NotificationsComponent,
  ...kinds
]
