import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllergiesSelectComponent } from './allergies-select.component';
import { AllergiesApiService } from "../../../services";

@NgModule({
  imports: [CommonModule],
  providers: [AllergiesApiService],
  declarations: [AllergiesSelectComponent],
  exports: [AllergiesSelectComponent]
})

export class AllergiesSelectModule { }
