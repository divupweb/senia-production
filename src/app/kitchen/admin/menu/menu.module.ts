import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FileUploadModule } from 'ng2-file-upload';
import { RatingModule } from 'ng2-bootstrap';
import {
  SharedModule,
  UserMenuModule,
  AllergiesSelectModule,
  SliderModule,
  AddCategoryModule
} from 'app/shared';

import { menuRoutes } from './menu.routes';
import { components, pipes } from './menu.components';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FileUploadModule,
    UserMenuModule,
    SharedModule,
    AllergiesSelectModule,
    SliderModule,
    RatingModule.forRoot(),
    AddCategoryModule,
  ],
  declarations: [
    ...components,
    ...pipes
  ]
})

export class MenuModule {
  static get routes() {
    return menuRoutes;
  }

  static forRoot() {
    return {
      ngModule: MenuModule
    };
  }
}
