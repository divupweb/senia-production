import { Component, OnInit, ViewChild } from '@angular/core'
import { LoginFormRequestService } from "app/home/shared";
import { LoginComponent } from "app/shared/auth/login";
import { ActivatedRoute } from "@angular/router";
import {Analytics, UrlsInfo} from "app/services";
import { EnterpriseRegionApiService } from "./enterprise-region-api.service";
@Component({
  selector: 'enterprise-region',
  styleUrls: [ './enterprise-region.scss', '../home/home.scss'],
  templateUrl: './enterprise-region.html'
})

export class EnterpriseRegionComponent implements OnInit {

  public urlsInfo: UrlsInfo;
  @ViewChild('login')
  public loginComponent: LoginComponent;

  public region: string;
  account = { settings: {}, logo: {displayUrl: ''} };
  logo;

  public constructor(protected formRequest: LoginFormRequestService,
                     protected route: ActivatedRoute,
                     protected analytics: Analytics,
                     protected service: EnterpriseRegionApiService) {
    this.urlsInfo = UrlsInfo;
  }

  public ngOnInit(): void {
    this.formRequest.requested$.subscribe(() => this.loginComponent.open());
    this.region = this.route.snapshot.params['region'];
    this.getCurrentAccount();
  }

  private getCurrentAccount() {
    this.service.get(this.region).subscribe((account) => {
      this.account = account;
      this.logo = this.account.logo.displayUrl;
      this.service.setLogoUrl(this.logo);
    })
  }

}
