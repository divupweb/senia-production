import { NgModule } from '@angular/core';
import { UserMenuService } from './user-menu.service';
import { UserMenuComponent } from './user-menu.component';
import {AppCommonModule} from "app/shared";


@NgModule({
  declarations: [
    UserMenuComponent
  ],
  imports: [
    AppCommonModule
  ],
  exports: [
    UserMenuComponent
  ]
})

export class UserMenuModule {
  static forRoot() {
    return {
      ngModule: UserMenuModule,
      providers: [ UserMenuService ]
    };
  }
}
