import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService, AuthService } from "../services";
import { UserMenuService } from '../shared';

@Component({
  selector: 'super-admin-area',
  templateUrl: './super-admin-area.html'
})

export class SuperAdminAreaComponent {
  user = {};
  constructor(private  state: AppStateService,
    private router: Router,
    private userMenu: UserMenuService,
    private auth: AuthService) { }

  ngOnInit() {
    if(!this.state.superAdmin()) {
      this.router.navigate(['/'])
    }
    this.user = this.state.currentUser();
  }
}
