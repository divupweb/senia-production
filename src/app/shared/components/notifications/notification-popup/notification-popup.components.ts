import { NotificationPopupComponent } from './notification-popup.component';

import * as items from './kinds';
let kinds = _.values(items);

export let components = [
  NotificationPopupComponent,
  ...kinds
];

export let exportedComponents = [
  NotificationPopupComponent
]
