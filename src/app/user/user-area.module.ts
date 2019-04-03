import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RatingModule } from 'ng2-bootstrap';

import {SharedModule, SharedUserModule, AllergiesSelectModule, AppCommonModule} from 'app/shared';
import { ErrorsModule } from "app/errors"

import { HeaderModule } from './header';
import { routes } from './user-area.route';

import { UserAreaComponent } from './user-area.component';
import {
  UserMenuComponent,
  SubscriptionsComponent,
  WeekSelectComponent,
  RatingPopupComponent,
  DishInfoPopupComponent,
  KitchenInfoPopup,
  MenuItemPopoverComponent,
  MenuItemComponent,
  CartComponent,
  ItemComponent
} from './menu';

import { UserFooterComponent } from './footer';
import {
  WeeklyOrdersItemComponent,
  WeeklyEditPopupComponent,
  MenuHeaderComponent
} from './shared';
import { ChartistModule } from "ng-chartist";
import { WeeklyMenuComponent } from './weekly-menu/';
import { CreditCardModule, PaypalModule } from 'app/shared';
import { PeriodicOrdersModule } from './periodic-orders';
import { providers } from './user-area.providers';
import {ContactPopupModule} from "app/shared/components/contact-popup";
import { CookieLawModule } from 'angular2-cookie-law';
import { PrivacyPolicyModule } from 'app/shared/components/privacy-policy';

@NgModule({
  imports: [
    AppCommonModule,
    ErrorsModule,
    ContactPopupModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
    RatingModule.forRoot(),
    SharedUserModule.forRoot(),
    AllergiesSelectModule,
    ChartistModule,
    CreditCardModule,
    PaypalModule,
    PeriodicOrdersModule.forRoot(),
    HeaderModule.forRoot(),
    PrivacyPolicyModule.forRoot(),
    CookieLawModule
  ],
  declarations: [
    UserFooterComponent,
    UserAreaComponent,
    RatingPopupComponent,
    UserMenuComponent,
    SubscriptionsComponent,
    WeekSelectComponent,
    MenuItemComponent,
    MenuItemPopoverComponent,
    WeeklyOrdersItemComponent,
    WeeklyEditPopupComponent,
    DishInfoPopupComponent,
    KitchenInfoPopup,
    WeeklyMenuComponent,
    CartComponent,
    ItemComponent,
    MenuHeaderComponent,
  ],
  providers: [
    providers
  ],
})
export class UserAreaModule { }
