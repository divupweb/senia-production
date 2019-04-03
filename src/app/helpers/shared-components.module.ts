import { NgModule } from '@angular/core';
import { APP_COMPONENTS } from 'app/helpers';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { PopoverModule } from "ngx-popover";
import { TranslateModule } from "@ngx-translate/core";
import { ImageBoxModule } from 'app/shared/components/image-box';
import { ImageUploadModule } from 'app/shared/components/image-upload';
import { SwiperModule } from "angular2-useful-swiper";
import { SharedDirectivesModule } from "./shared-directives.module";
import {SharedPipesModule} from "app/pipes";
import {DatepickerModule} from "ng2-bootstrap";


@NgModule({
  imports: [
    CommonModule,
    DatepickerModule.forRoot(),
    FormsModule,
    FileUploadModule,
    PopoverModule,
    SwiperModule,
    SharedPipesModule.forRoot(),
    TranslateModule,
    ImageBoxModule,
    ImageUploadModule,
    SharedDirectivesModule,
  ],
  declarations: [
    ...APP_COMPONENTS
  ],
  exports: [
    ...APP_COMPONENTS,
    DatepickerModule,
    PopoverModule,
    TranslateModule,
    SwiperModule,
    SharedDirectivesModule,
  ],
})

export class SharedComponentsModule {
  static forRoot() {
    return {
      ngModule: SharedComponentsModule
    };
  }
}
