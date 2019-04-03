import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'ng2-bootstrap/rating';
import { LineCalendarModule } from 'app/shared/components/line-calendar';
import { NotificationPopupModule } from 'app/shared/components';
import { SharedPipesModule } from 'app/pipes';
import { SharedComponentsModule } from "app/helpers";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { KitchenDashboardComponent } from './dashboard.component'
import { KitchenDetailsPopupComponent } from './kitchen-details-popup';
import { KitchenRatingsPopupComponent } from './rating-popup';
import { PrintPopoverComponent } from './print-popover';
import { CateringRequestComponent } from './catering-request';
import { components as notificationsComponents } from './notifications';
import { UserMenuModule } from '../../../shared';

@NgModule({
  imports: [
    CommonModule,
    LineCalendarModule,
    RatingModule.forRoot(),
    InfiniteScrollModule,
    SharedPipesModule.forRoot(),
    SharedComponentsModule.forRoot(),
    FormsModule,
    NotificationPopupModule,
    UserMenuModule
  ],
  declarations: [
    KitchenDashboardComponent,
    KitchenRatingsPopupComponent,
    KitchenDetailsPopupComponent,
    PrintPopoverComponent,
    CateringRequestComponent,
    notificationsComponents,
  ],
})

export class KitchenDashboardModule {
  static forRoot() {
    return {
      ngModule: KitchenDashboardModule
    };
  }
}
