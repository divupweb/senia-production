import {Component, Input, Renderer2, ViewChild} from "@angular/core";
import {Analytics, ToastService, UrlsInfo, WindowRef} from "app/services";
import {LoginFormRequestService, MarketplaceOverviewService} from "app/home/shared";
import { DecisionMakerComponent, DecisionMakerApiService } from 'app/shared/components/decision-maker'

@Component({
  selector: 'home-for-companies',
  styleUrls: [ 'home-for-companies.scss', '../home.scss' ],
  templateUrl: './home-for-companies.html'
})

export class HomeForCompaniesComponent {
  @ViewChild('companyRegister') companyRegister;
  urlsInfo;

  constructor(public overview: MarketplaceOverviewService,
              public loginForm: LoginFormRequestService,
              private renderer: Renderer2,
              public decision: DecisionMakerApiService,
              public analytics: Analytics) {
    this.urlsInfo = UrlsInfo;
  }

    ngAfterViewInit() {
      if (this.renderer) {
        this.renderer.setStyle(document.querySelector('.ng-footer-i'), 'padding-bottom', '50px');
        this.renderer.setStyle(document.querySelector('.ng-footer-app-wrap'), 'display', 'none');
        this.renderer.setStyle(document.querySelector('.customers'), 'z-index', '3');
      }
    }
}
