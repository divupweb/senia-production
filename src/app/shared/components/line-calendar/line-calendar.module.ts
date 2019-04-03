import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerModule } from 'ng2-bootstrap';
import { SharedPipesModule } from 'app/pipes';

import { DayIcons } from './day-icons';
import { LineCalendarComponent } from './line-calendar.component';
import { LineCalendarWeeklyComponent } from './line-calendar-weekly.component';
import { LineCalendarWeekDaysComponent } from './line-calendar-week-days.component';
import { AppCommonModule } from "app/shared";

const calendars = [
  LineCalendarComponent,
  LineCalendarWeeklyComponent,
  LineCalendarWeekDaysComponent
];

@NgModule({
  declarations: [
    DayIcons,
    ...calendars
  ],
  imports: [
    AppCommonModule,
    FormsModule,
    DatepickerModule.forRoot(),
    SharedPipesModule.forRoot()
  ],
  exports: [
    ...calendars
  ]
})

export class LineCalendarModule {}
