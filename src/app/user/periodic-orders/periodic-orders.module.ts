import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule, DefaultOrdersModule } from 'app/shared';
import { HeaderModule } from '../header';

import { PeriodicOrdersComponent } from './periodic-orders.component';

let routes = [
  { path: 'periodic-orders', component: PeriodicOrdersComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    DefaultOrdersModule.forRoot(),
    HeaderModule.forRoot()
  ],
  declarations: [
    PeriodicOrdersComponent,
  ]
})
export class PeriodicOrdersModule {
  static get routes() {
    return routes;
  }

  static forRoot() {
    return {
      ngModule: PeriodicOrdersModule,
    };
  }
}
