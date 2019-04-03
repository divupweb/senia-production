import { NgModule } from '@angular/core';
import { AppCommonModule } from "app/shared";
import { KITCHEN_ADMIN_COMPONENTS } from 'app/helpers';

import {
  DatepickerModule,
  TimepickerModule,
  ProgressbarModule,
} from 'ng2-bootstrap';

import { FileUploadModule } from 'ng2-file-upload';
import {
  LineCalendarModule,
  SliderModule,
  ImageBoxModule,
  ImageUploadModule
} from './components';


@NgModule({
  imports: [
    AppCommonModule,
    LineCalendarModule,
    DatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    FileUploadModule,
    ProgressbarModule.forRoot(),
    SliderModule
  ],
  declarations: [
    ...KITCHEN_ADMIN_COMPONENTS,
  ],
  exports: [
    ...KITCHEN_ADMIN_COMPONENTS,
    LineCalendarModule,
    FileUploadModule,
    ProgressbarModule,
    DatepickerModule,
    TimepickerModule,
    SliderModule,
    ImageBoxModule,
    ImageUploadModule
  ],
})

export class SharedKitchenAdminModule {
  static forRoot() {
    return {
      ngModule: SharedKitchenAdminModule
    };
  }
}
