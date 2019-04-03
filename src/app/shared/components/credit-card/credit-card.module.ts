import { NgModule } from '@angular/core';
import { CreditCardApiService } from "./credit-card-api.service";
import { CreditCard } from "./credit-card";

@NgModule({
  providers: [
    CreditCardApiService,
    CreditCard
  ]
})
export class CreditCardModule {}
