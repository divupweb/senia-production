import { NgModule } from '@angular/core';
import { AdminPaginationComponent } from "./admin-pagination.component";
import { NgxPaginationModule } from 'ngx-pagination';

import { AppCommonModule } from "app/shared";

@NgModule({
  imports: [
    AppCommonModule,
    NgxPaginationModule
  ],
  declarations: [
    AdminPaginationComponent
  ],
  exports: [
    NgxPaginationModule,
    AdminPaginationComponent
  ]
})
export class AdminPaginationModule { }
