import { NgModule } from '@angular/core';
import { PIPES } from './pipes';

@NgModule({
  declarations: [...PIPES],
  exports: [...PIPES],
})
export class SharedPipesModule {
  static forRoot() {
    return {
      ngModule: SharedPipesModule
    };
  }
}
