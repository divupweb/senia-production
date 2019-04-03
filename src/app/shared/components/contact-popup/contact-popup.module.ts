import { NgModule } from '@angular/core';
import {AppCommonModule} from "app/shared";
import {ContactPopupComponent} from "./contact-popup.component";
import {ContactApiService} from "./contact-api.service";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    AppCommonModule,
    ReactiveFormsModule
  ],
  providers: [ContactApiService],
  declarations: [ContactPopupComponent],
  exports: [ContactPopupComponent]
})

export class ContactPopupModule { }
