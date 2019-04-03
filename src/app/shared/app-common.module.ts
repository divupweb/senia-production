import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from "@ngx-translate/core";
import { SharedPipesModule } from 'app/pipes';


@NgModule({
  imports: [
    SharedPipesModule.forRoot()
  ],
  exports: [
    CommonModule,
    TranslateModule,
    SharedPipesModule
  ],
  declarations: [ ]
})
export class AppCommonModule {
  static forRoot() {
    return {
      ngModule: AppCommonModule
    };
  }
}
