import { NgModule } from '@angular/core';
import { ChangePasswordFormComponent } from "./change-password-form.component";
import {AppCommonModule} from "app/shared";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ChangePasswordFormComponent
  ],
  exports: [
    ChangePasswordFormComponent
  ],
  imports: [
    AppCommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

export class ChangePasswordModule {}
