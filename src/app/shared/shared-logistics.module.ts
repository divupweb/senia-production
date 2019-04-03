import { NgModule } from '@angular/core';
import {AppCommonModule} from "app/shared";

import {
  LineCalendarModule,
} from './components';

import { DragulaModule } from 'ng2-dragula';


@NgModule({
  imports: [
    AppCommonModule,
    LineCalendarModule,
    DragulaModule
  ],
  declarations: [],
  exports: [
    LineCalendarModule,
    DragulaModule
  ],
})

export class SharedLogisticsModule {
  static forRoot() {
    return {
      ngModule: SharedLogisticsModule
    };
  }
}
