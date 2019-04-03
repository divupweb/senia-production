import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SUPER_ADMIN_COMPONENTS } from '../helpers';
import { FileUploadModule } from 'ng2-file-upload';
import { AdminPaginationModule } from './components';

import {
  ImageBoxModule,
  ImageUploadModule
} from './components';
import {AppCommonModule} from "app/shared";

@NgModule({
  imports: [
    AppCommonModule,
    FileUploadModule
  ],
  declarations: [
    ...SUPER_ADMIN_COMPONENTS
  ],
  exports: [
    ...SUPER_ADMIN_COMPONENTS,
    FileUploadModule,
    AdminPaginationModule,
    ImageBoxModule,
    ImageUploadModule
  ],
})

export class SharedSuperAdminModule {
  static forRoot() {
    return {
      ngModule: SharedSuperAdminModule
    };
  }
}
