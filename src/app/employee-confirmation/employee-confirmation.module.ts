import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { EmployeeConfirmationApiService } from './employee-confirmation-api.service';
import { EmployeeConfirmationComponent } from './employee-confirmation.component';
import { routes } from './employee-confirmation.routes';
import { TermsAndConditionsModule } from '../shared/components/terms-and-conditions';
import {AppCommonModule, SharedModule} from "app/shared";

@NgModule({
  bootstrap: [],
  declarations: [EmployeeConfirmationComponent],
  imports: [
    AppCommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule.forRoot(),
    TermsAndConditionsModule.forRoot(),
  ],
  providers: [ EmployeeConfirmationApiService ]
})

export class EmployeeConfirmationModule {
}
