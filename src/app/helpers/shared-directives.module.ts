import { NgModule } from '@angular/core';
import { DIRECTIVES } from './directives';

@NgModule({
  imports: [  ],
  declarations: [
    ...DIRECTIVES
  ],
  exports: [
    ...DIRECTIVES
  ],
})

export class SharedDirectivesModule {}
