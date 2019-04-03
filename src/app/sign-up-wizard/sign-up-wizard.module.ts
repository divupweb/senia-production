import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {SharedModule, AllergiesSelectModule, DefaultOrdersModule, AppCommonModule} from 'app/shared';
import { CreditCardModule, PaypalModule } from 'app/shared';

import { components } from './sign-up-wizard.components';
import { routes } from './sign-up-wizard.routes';
import { providers } from './sign-up-wizard.providers';

@NgModule({
  imports: [
    AppCommonModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
    DefaultOrdersModule.forRoot(),
    AllergiesSelectModule,
    CreditCardModule,
    PaypalModule
  ],
  declarations: [components],
  providers: [providers]
})
export class SignUpWizardModule { }
