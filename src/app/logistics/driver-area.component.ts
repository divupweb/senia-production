import { Component, ViewEncapsulation } from '@angular/core';

import { AppStateService, AuthService } from '../services';
import { UserMenuService } from '../shared';


@Component({
  selector: 'driver-area',
  styleUrls: [ 'driver-area.scss' ],
  templateUrl: './driver-area.html'
})

export class DriverAreaComponent {
  constructor(  private userMenu: UserMenuService, private auth: AuthService) { }
}
