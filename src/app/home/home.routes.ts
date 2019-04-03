import { HomeComponent } from './home.component';
import { HomeEatComponent } from './home-eat';
import { HomeForCompaniesComponent } from './home-for-companies';
import { HomeCitiesComponent } from './home-cities';
import { HomeMenuComponent } from './home-menu';
import { HomeForRestaurantsComponent } from './home-for-restaurants';
import {EmployeeRegisterComponent} from "app/shared/auth/employee-register";
import { TermsAndConditionsExtComponent } from './terms-and-conditions-ext';
import { TermsAndConditionsKitchenExtComponent } from './terms-and-conditions-kitchen-ext';
import { PrivacyPolicyExtComponent } from './privacy-policy-ext';
import { CookiePolicyExtComponent } from './cookie-policy-ext';
import { HomeAboutUsComponent } from './about-us';
import { HomeProprietaryTechnologyComponent } from './proprietary-technology';
import { HomeForDriversComponent } from './for-drivers';
import { HomeCateringComponent } from './catering';
// import { HomeForRealEstateComponent } from './for-real-estate';
export const routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'for-companies', pathMatch: 'full' },
      { path: 'eat', redirectTo: 'for-companies', pathMatch: 'full' },
      { path: 'for-companies', component: HomeForCompaniesComponent },
      { path: 'cities', component: HomeCitiesComponent },
      { path: 'menu', component: HomeMenuComponent },
      // { path: 'cook', component: HomeCookComponent },
      { path: 'for-restaurants', component: HomeForRestaurantsComponent },
      { path: 'about-us', component: HomeAboutUsComponent },
      { path: 'proprietary-technology', component:HomeProprietaryTechnologyComponent },
      { path: 'for-drivers', component: HomeForDriversComponent },
      { path: 'privacy-policy', component: PrivacyPolicyExtComponent },
      { path: 'terms-of-service', component: TermsAndConditionsExtComponent },
      { path: 'cookie-policy', component: CookiePolicyExtComponent },
      { path: 'terms-of-service-kitchen', component: TermsAndConditionsKitchenExtComponent },
      { path: 'catering', component: HomeCateringComponent },
      // { path: 'for-real-estate', component: HomeForRealEstateComponent },
    ],
  }, {
    path: 'sign-up',
    component: EmployeeRegisterComponent
  },
];
