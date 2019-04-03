import { NgModule } from '@angular/core';
import { DatepickerModule } from 'ng2-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { nvD3 } from 'ng2-nvd3';
import { USER_COMPONENTS } from '../helpers';
import { AllergiesSelectModule, LineCalendarModule } from './components';
import { SharedPipesModule } from "../pipes";
import {AppCommonModule} from "app/shared";




@NgModule({
  imports: [
    AppCommonModule,
    DatepickerModule.forRoot(),
    SharedPipesModule.forRoot(),
    LineCalendarModule,
    InfiniteScrollModule,
    AllergiesSelectModule
  ],
  declarations: [
    ...USER_COMPONENTS,
    nvD3
  ],
  exports: [
    ...USER_COMPONENTS,
    DatepickerModule,
    LineCalendarModule,
    InfiniteScrollModule,
    nvD3
  ],
})

export class SharedUserModule {
  static forRoot() {
    return {
      ngModule: SharedUserModule
    };
  }
}
