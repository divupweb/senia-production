import {Component, ViewChild} from "@angular/core";
import {Analytics, UrlsInfo} from "app/services";
import {LoginFormRequestService, MarketplaceOverviewService} from "app/home/shared";


@Component({
  selector: 'home-eat',
  styleUrls: [ 'home-eat.scss', '../home.scss' ],
  templateUrl: './home-eat.html'
})

export class HomeEatComponent {
  @ViewChild('companyRegister') companyRegister;
  urlsInfo;

  constructor(public overview: MarketplaceOverviewService,
              public loginForm: LoginFormRequestService,
              public analytics: Analytics) {
    this.urlsInfo = UrlsInfo;
  }

  public inView(event): void {
    if (event.value) {
      event.target.classList.add('animated')
    }
  }
}
