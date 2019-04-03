import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../index';

import { components } from './default-orders.components';
import { providers } from './default-orders.providers';

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot()
  ],
  declarations: [components],
  exports: [components],
  providers: [providers]
})
export class DefaultOrdersModule {
  static forRoot() {
    return {
      ngModule: DefaultOrdersModule
    };
  }
}
