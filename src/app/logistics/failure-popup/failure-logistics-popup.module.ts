import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FailureLogisitsPopupComponent } from './failure-logistics-popup.component';
import { AppCommonModule } from "app/shared";

@NgModule({
  imports: [AppCommonModule],
  declarations: [FailureLogisitsPopupComponent],
  exports: [FailureLogisitsPopupComponent]
})
export class FailureLogisticsPopupModule { }
