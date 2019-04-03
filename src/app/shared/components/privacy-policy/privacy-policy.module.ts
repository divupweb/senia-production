import { NgModule } from '@angular/core';
import { ModalModule } from 'ng2-bootstrap';
import { AppCommonModule } from "app/shared";
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { PrivacyPolicyService } from './privacy-policy.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ PrivacyPolicyComponent ],
  imports: [ ModalModule.forRoot(),
             AppCommonModule,
             RouterModule],
  exports: [ PrivacyPolicyComponent ]
})

export class PrivacyPolicyModule {
  static forRoot() {
    return {
      ngModule: PrivacyPolicyModule,
      providers: [ PrivacyPolicyService ]
    };
  }
}
