import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { SharedPipesModule } from '../pipes';
import { SharedComponentsModule } from '../helpers';
import {
  CarouselModule,
  DatepickerModule,
  ModalModule
} from 'ng2-bootstrap';
import { PopoverModule } from "ngx-popover";
import { SelectModule } from 'ng2-select';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import {AppCommonModule} from "app/shared";


@NgModule({
  imports: [
    AppCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    SharedPipesModule.forRoot(),
    SharedComponentsModule.forRoot(),
    PopoverModule,
    SelectModule,
    Ng2PageScrollModule.forRoot()
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    ModalModule,
    SharedPipesModule,
    SharedComponentsModule,
    PopoverModule,
    DatepickerModule,
    SelectModule,
    Ng2PageScrollModule
  ],
  declarations: [ ]
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule
    };
  }
}
