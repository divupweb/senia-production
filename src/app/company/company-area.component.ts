import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  CompanyImageApiService,
  CompanyLogoChangedService
} from "./services";

import { UserMenuService } from '../shared';
import {
  AppStateService,
  AuthService,
  ToastService
} from "../services";

@Component({
  selector: 'company-area',
  styleUrls: [ 'company-area.scss' ],
  templateUrl: './company-area.html'
})

export class CompanyAreaComponent {
  public displayUrl: string;
  company = {};
  userTitle = '';
  user: any;
  displayConversionCode = false;
  constructor(private  _state: AppStateService,
              private router: Router,
              private route: ActivatedRoute,
              public userMenu: UserMenuService,
              public auth: AuthService,
              public state: AppStateService,
              protected imageService: CompanyImageApiService,
              protected toast: ToastService,
              protected logoService: CompanyLogoChangedService) {
    this.logoService.urlEmitted.subscribe(
      (url) => this.displayUrl = url
    )
  }

  ngOnInit() {
    this.loadUser();
    if(!this._state.companyAdmin()) {
     this.router.navigate(['/']);
     return;
    }
    this.imageService.get().subscribe(
      (image) => this.displayUrl =  image ? image.display_url : null,
      (error) => this.toast.error(error)
    );
    this.setCompany();
    this.auth.currentUser(0).subscribe((data) => this.setCompany())
    this.route.queryParams.subscribe((params) => this.displayConversionCode = !!params['new'])
  }
  loadUser() {
    this.user = this.state.currentUser();
    this.setUserTitle();
  }
  navigateMarketplace() {
    this.router.navigate(['user', 'menu']);
  }
  private setUserTitle() {
    this.userTitle = '';
    if (this.user) {
      this.userTitle = this.user.email;
      if (this.state.fakeCompanyAdmin()) {
        var company = this.state.get('company');
        if (company) this.userTitle = company.name;
      }
      if (this.state.fakeKitchenAdmin()) {
        var kitchen = this.state.get('kitchen');
        if (kitchen) this.userTitle = kitchen.name;
      }
    }
  }
  private setCompany() {
    this.company = this._state.currentCompany();
  }
}
