import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogisticsLocationsComponent } from './logistics-locations.component';
import { FailureLogisticsPopupModule } from '../failure-popup';
import { DragulaModule } from 'ng2-dragula';
import {AppCommonModule} from "app/shared";
import { SharedDirectivesModule } from 'app/helpers/shared-directives.module'
import { SharedPipesModule } from 'app/pipes';

@NgModule({
  imports: [
    AppCommonModule,
    FailureLogisticsPopupModule,
    RouterModule,
    DragulaModule,
    SharedDirectivesModule,
    SharedPipesModule.forRoot()
  ],
  declarations: [LogisticsLocationsComponent],
  exports: [LogisticsLocationsComponent]
})
export class LogisticsLocationsModule { }
