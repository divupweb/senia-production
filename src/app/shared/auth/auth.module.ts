import {NgModule} from "@angular/core";
import {LoginComponent} from "./login";
import {KitchenRegisterComponent} from "./kitchen-register";
import {CompanyRegisterComponent} from "./company-register";
import {EmployeeRegisterComponent} from "./employee-register";
import {AppCommonModule, SharedModule, TermsAndConditionsModule, DecisionMakerModule} from "app/shared";
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    CompanyRegisterComponent,
    EmployeeRegisterComponent,
    KitchenRegisterComponent,
    LoginComponent,
  ],
  exports: [
    CompanyRegisterComponent,
    EmployeeRegisterComponent,
    KitchenRegisterComponent,
    LoginComponent,
    TermsAndConditionsModule,
  ],
  imports: [
    AppCommonModule,
    RouterModule,
    SharedModule.forRoot(),
    TermsAndConditionsModule.forRoot(),
    DecisionMakerModule.forRoot()
  ]
})
export class AuthModule {
  static forRoot() {
    return {
      ngModule: AuthModule
    };
  }
}
