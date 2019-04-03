import { NgModule } from '@angular/core';
import { COMPANY_ADMIN_COMPONENTS } from '../helpers';

import {
  DatepickerModule,
  ProgressbarModule,
  TimepickerModule,
  RatingModule
} from 'ng2-bootstrap';

import { FileUploadModule } from 'ng2-file-upload';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  LineCalendarModule,
  SliderModule,
  NotificationPopupModule
} from './components';
import { AppCommonModule } from "app/shared";


@NgModule({
  imports: [
    AppCommonModule,
    LineCalendarModule,
    DatepickerModule.forRoot(),
    FileUploadModule,
    ProgressbarModule.forRoot(),
    SliderModule,
    TimepickerModule.forRoot(),
    RatingModule.forRoot(),
    InfiniteScrollModule,
    NotificationPopupModule
  ],
  declarations: [
    ...COMPANY_ADMIN_COMPONENTS,
  ],
  exports: [
    ...COMPANY_ADMIN_COMPONENTS,
    LineCalendarModule,
    FileUploadModule,
    ProgressbarModule,
    DatepickerModule,
    SliderModule,
    TimepickerModule,
    InfiniteScrollModule,
    NotificationPopupModule
  ],
})

export class SharedCompanyAdminModule {
  static forRoot() {
    return {
      ngModule: SharedCompanyAdminModule
    };
  }
}
