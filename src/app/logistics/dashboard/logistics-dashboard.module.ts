import { NgModule } from '@angular/core';
import { LogisticsDashboardComponent } from './logistics-dashboard.component';
import {AppCommonModule, LineCalendarModule} from 'app/shared';
import { LogisticsStatuses } from './statuses';
import { FailureLogisticsPopupModule } from '../failure-popup';
import {SharedPipesModule} from "app/pipes";
import { MonthSelectModule } from 'app/shared/month-select.module'


@NgModule({
  imports: [
    AppCommonModule,
    SharedPipesModule.forRoot(),
    LineCalendarModule,
    FailureLogisticsPopupModule,
    MonthSelectModule
  ],
  declarations: [ LogisticsDashboardComponent, LogisticsStatuses ],
  exports: [ LogisticsDashboardComponent ]
})
export class LogisticsDashboardModule { }
