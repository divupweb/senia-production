import { NgModule } from '@angular/core';
import { PaypalApiService } from "./paypal-api.service";
import { Paypal } from "./paypal";

@NgModule({
  providers: [
    PaypalApiService,
    Paypal
  ]
})
export class PaypalModule {}
