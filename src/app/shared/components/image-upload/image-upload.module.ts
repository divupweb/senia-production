import { NgModule } from '@angular/core';
import { ImageUploadComponent } from './image-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { AppCommonModule } from "app/shared"

@NgModule({
  imports: [
    AppCommonModule,
    FileUploadModule
  ],
  declarations: [ImageUploadComponent],
  exports: [ImageUploadComponent]
})
export class ImageUploadModule { }
