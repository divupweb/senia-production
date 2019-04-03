import { NgModule } from '@angular/core';
import { SharedPipesModule } from 'app/pipes/shared-pipes.module'
import { MonthSelectComponent } from './components';
import { AppCommonModule } from './app-common.module'

@NgModule({
  imports: [
    SharedPipesModule,
    AppCommonModule
  ],
  declarations: [
    MonthSelectComponent
  ],
  exports: [
    MonthSelectComponent
  ],
})

export class MonthSelectModule {
}
