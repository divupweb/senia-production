import {Component, Input, ViewChild} from '@angular/core'
import {LoginFormRequestService, MarketplaceOverviewService} from "app/home/shared";
import {KitchenRegisterComponent} from "app/shared/auth/kitchen-register";


@Component({
  selector: 'home-for-restaurants',
  styleUrls: [ '../home.scss', 'home-for-restaurants.scss'],
  templateUrl: './home-for-restaurants.html',
})

export class HomeForRestaurantsComponent {

  @ViewChild('form')
  public form: KitchenRegisterComponent;
  constructor(public overview: MarketplaceOverviewService,
              public loginForm: LoginFormRequestService) {}


  public inView(event): void {
    if (event.value) {
      event.target.classList.add('animated')
    }
  }

}

// export class FooterComponent {
//     @Input() showInstallButtons;
// }