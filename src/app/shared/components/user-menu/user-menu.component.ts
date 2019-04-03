import { Component } from '@angular/core';
import { AuthService, AppStateService } from '../../../services';
import { UserMenuService } from './user-menu.service';
import { Router } from '@angular/router'

@Component({
  selector: 'user-menu',
  styleUrls: ['user-menu.scss'],
  templateUrl: './user-menu.html'
})

export class UserMenuComponent {
  constructor(
    private auth: AuthService,
    public state: AppStateService,
    private userMenu: UserMenuService,
    private router: Router) { }
  showLogin: boolean;
  userTitle = '';
  user: any;

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.user = this.state.currentUser();
    this.setUserTitle();
  }

  onMenuToggle() {
    this.userMenu.menuToggle();
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
}
