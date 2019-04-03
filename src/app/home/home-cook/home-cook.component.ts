import {Component, ViewChild} from '@angular/core'
import {LoginFormRequestService, MarketplaceOverviewService} from "app/home/shared";
import {KitchenRegisterComponent} from "app/shared/auth/kitchen-register";


@Component({
  selector: 'home-cook',
  styleUrls: [ 'home-cook.scss', '../home.scss'],
  templateUrl: './home-cook.html',
})

export class HomeCookComponent {

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
