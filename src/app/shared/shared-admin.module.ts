import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng2-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppCommonModule } from "app/shared";
import { ADMIN_COMPONENTS, SharedDirectivesModule } from 'app/helpers';
import { SharedPipesModule } from 'app/pipes';
import {
  AdminPaginationModule,
  SliderModule,
  ImageBoxModule,
  ImageUploadModule,
  ChangePasswordModule,
  NotificationPopupModule
} from './components';

@NgModule({
  imports: [
    AppCommonModule,
    ChangePasswordModule,
    SharedPipesModule.forRoot(),
    SelectModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    SharedDirectivesModule,
    NotificationPopupModule
  ],
  declarations: [
    ...ADMIN_COMPONENTS,
  ],
  exports: [
    ...ADMIN_COMPONENTS,
    AdminPaginationModule,
    SliderModule,
    ImageBoxModule,
    ImageUploadModule,
    SelectModule,
    InfiniteScrollModule,
    SharedDirectivesModule,
    NotificationPopupModule
  ],
})

export class SharedAdminModule {
  static forRoot() {
    return {
      ngModule: SharedAdminModule
    };
  }
}
