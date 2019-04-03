import { NgModule } from '@angular/core';
import { AppCommonModule } from "app/shared";
import { GenerateInvoiceComponent } from './generate-invoice.component';
import { SharedDirectivesModule } from "app/helpers";
import { SharedPipesModule } from 'app/pipes';

@NgModule({
  imports: [
    AppCommonModule,
    SharedDirectivesModule,
    SharedPipesModule
  ],
  declarations: [GenerateInvoiceComponent],
  exports: [GenerateInvoiceComponent]
})
export class GenerateInvoiceModule { }
