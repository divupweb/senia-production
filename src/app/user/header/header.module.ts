import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule, AllergiesSelectModule } from 'app/shared';
import { ChartistModule } from "ng-chartist";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


import { components, componentsForExport } from './header.components';
import { providers } from './header.providers';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule.forRoot(),
    AllergiesSelectModule,
    ChartistModule,
    InfiniteScrollModule,
  ],
  declarations: [components],
  exports: [componentsForExport]
})
export class HeaderModule {
  static forRoot() {
    return {
      ngModule: HeaderModule,
      providers: [providers]
    };
  }
}
