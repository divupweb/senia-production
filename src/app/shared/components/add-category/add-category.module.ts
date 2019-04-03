import { NgModule } from '@angular/core';
import { AppCommonModule } from "app/shared";
import { AddCategoryComponent } from "./add-category.component";
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    AppCommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    AddCategoryComponent
  ],
  exports: [
    AddCategoryComponent
  ]
})
export class AddCategoryModule { }
