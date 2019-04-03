import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AccountsApiService,
  AccountsProxy,
  CompanyInfoApiService,
  WindowRef
} from "app/services";
import { SharedModule, TermsAndConditionsModule, DecisionMakerModule } from "app/shared";

import { routes } from './home.routes';
import { HomeComponent } from './home.component';
import { HomeHeaderComponent } from './header';
import { HomeFooterComponent } from './footer';
import { HomeEatComponent } from './home-eat';
import { HomeForCompaniesComponent } from './home-for-companies';
import { HomeCitiesComponent } from './home-cities';
import { HomeMenuComponent } from './home-menu';
import { HomeForRestaurantsComponent } from './home-for-restaurants';
import { HomeAboutUsComponent } from './about-us';
import { HomeProprietaryTechnologyComponent } from './proprietary-technology';
import { HomeForDriversComponent } from './for-drivers';
import { DriverRequestComponent } from './for-drivers/driver-request'
// import { HomeForRealEstateComponent } from './for-real-estate';
import {LocationPopupComponent} from "app/home/home-menu/location-popup";

import {LoginFormRequestService, MarketplaceOverviewService} from "app/home/shared";
import { ShareButtonsModule } from "ngx-sharebuttons";
import { NearestLocationService } from "app/services/nearest-location.service";
import { InViewportModule } from 'ng-in-viewport';
import {AuthModule} from "app/shared/auth";
import {ContactPopupModule} from "app/shared/components/contact-popup";
import { TermsAndConditionsExtComponent } from './terms-and-conditions-ext';
import { PrivacyPolicyExtComponent } from './privacy-policy-ext';
import { CookiePolicyExtComponent } from './cookie-policy-ext';
import { TermsAndConditionsKitchenExtComponent } from './terms-and-conditions-kitchen-ext';
import { HomeCateringComponent } from './catering';

@NgModule({
  declarations: [
    HomeComponent,
    HomeHeaderComponent,
    HomeFooterComponent,
    HomeEatComponent,
    HomeForCompaniesComponent,
    HomeCitiesComponent,
    HomeMenuComponent,
    LocationPopupComponent,

    // HomeCookComponent,
    TermsAndConditionsExtComponent,
    PrivacyPolicyExtComponent,
    HomeForRestaurantsComponent,
    HomeAboutUsComponent,
    HomeCateringComponent,
    HomeProprietaryTechnologyComponent,
    HomeForDriversComponent,
    DriverRequestComponent,
    CookiePolicyExtComponent,
    TermsAndConditionsKitchenExtComponent
  ],
  imports: [
    AuthModule.forRoot(),
    ContactPopupModule,
    InViewportModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
    ShareButtonsModule.forRoot(),
    TermsAndConditionsModule.forRoot(),
    DecisionMakerModule.forRoot()
  ],
  providers: [
    AccountsApiService,
    AccountsProxy,
    CompanyInfoApiService,
    LoginFormRequestService,
    MarketplaceOverviewService,
    NearestLocationService,
    WindowRef
  ]
})
export class HomeModule {
  public static routes = routes;
}
