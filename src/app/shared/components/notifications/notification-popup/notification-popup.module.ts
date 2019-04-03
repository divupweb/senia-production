import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'ng2-bootstrap/rating';
import { AppCommonModule } from "app/shared";
import { SharedPipesModule } from 'app/pipes';
import { SharedDirectivesModule } from 'app/helpers/shared-directives.module';
import { components, exportedComponents } from './notification-popup.components';

@NgModule({
  imports: [
    AppCommonModule,
    SharedPipesModule,
    SharedDirectivesModule,
    RatingModule.forRoot(),
    FormsModule, // RatingModule don't work without it
  ],
  declarations: [components],
  exports: [exportedComponents]
})
export class NotificationPopupModule { }
