import {NgModule} from "@angular/core";
import {EnterpriseRegionComponent} from "./enterprise-region.component";
import {RouterModule} from "@angular/router";
import {AppCommonModule, SharedModule} from "app/shared";
import {EnterpriseRegionHeaderComponent} from "./header";
import {LoginFormRequestService} from "app/home/shared";
import {AuthModule} from "app/shared/auth";
import {AccountsApiService, AccountsProxy} from "app/services";
import {NearestLocationService} from "app/services/nearest-location.service";
import {CompaniesPopupComponent, SignUpComponent} from "./sign-up";
import {EnterpriseRegionApiService} from "./enterprise-region-api.service"

const routes = [
  { path: ':region', component: EnterpriseRegionComponent },
  { path: ':region/sign_up', component: SignUpComponent }
];

@NgModule({
  declarations: [
    CompaniesPopupComponent,
    EnterpriseRegionComponent,
    EnterpriseRegionHeaderComponent,
    SignUpComponent
  ],
  imports: [
    AppCommonModule,
    AuthModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
  ],
  providers: [
    AccountsApiService,
    AccountsProxy,
    LoginFormRequestService,
    NearestLocationService,
    EnterpriseRegionApiService
  ]
})

export class EnterpriseRegionModule {
  public static routes = routes;
}
