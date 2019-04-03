import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  SharedModule,
  SharedCompanyAdminModule,
  UserMenuModule,
  CreditCardModule,
  PaypalModule
} from 'app/shared';

import { ErrorsModule } from "app/errors"
import { routes } from './company-area.route';
import { components } from './company-area.components';
import { providers } from './company-area.providers';

@NgModule({
  imports: [
    CommonModule,
    ErrorsModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
    SharedCompanyAdminModule.forRoot(),
    UserMenuModule.forRoot(),
    CreditCardModule,
    PaypalModule
  ],
  declarations: [
    components
  ],
  providers: [
    providers
  ]
})
export class CompanyAreaModule { }
