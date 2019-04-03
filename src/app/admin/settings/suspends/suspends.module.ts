import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule, AdminPaginationModule, AppCommonModule } from 'app/shared';
import { SharedComponentsModule } from "app/helpers";

import { SuspendsApiService, SuspendsDataService } from './services';

// Components
import { SuspendsComponent } from './suspends.component';
import { FormSuspendsComponent } from './form/';
import { EventsComponent } from './events';

let routes = [
  { path: 'suspends', component: SuspendsComponent}
  ];

@NgModule({
  imports: [
    AppCommonModule,
    SharedModule,
    RouterModule,
    SharedComponentsModule.forRoot(),
    AdminPaginationModule,
  ],
  declarations: [
    SuspendsComponent,
    FormSuspendsComponent,
    EventsComponent,
  ],
  providers: [
    SuspendsApiService,
    SuspendsDataService
  ]
})

export class SuspendsModule {
  static get routes() {
    return routes;
  }
}
