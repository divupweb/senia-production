import { Injectable } from '@angular/core';
import { AppStateService } from '../../services';

@Injectable()
export class UserStateService {
  user: any;


  constructor(private state: AppStateService) {
    this.getUser();
  }

  active() {
    return !!(this.user && this.user.active);
  }

  canEdit() {
    this.getUser();
    return !!(this.user && this.user.can_edit_orders);
  }

  getUser() {
    this.user = this.state.currentUser();
    return this.user;
  }

  setUser(user) {
    this.state.set('current', user);
    this.user = user;
  }
}
