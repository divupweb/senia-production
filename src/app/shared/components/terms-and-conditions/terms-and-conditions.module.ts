import { NgModule } from '@angular/core';
import { ModalModule } from 'ng2-bootstrap';
import { AppCommonModule } from "app/shared";
import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ TermsAndConditionsComponent ],
  imports: [ ModalModule.forRoot(),
             RouterModule,
             AppCommonModule ],
  exports: [ TermsAndConditionsComponent ]
})

export class TermsAndConditionsModule {
  static forRoot() {
    return {
      ngModule: TermsAndConditionsModule,
      providers: [ TermsAndConditionsService ]
    };
  }
}
