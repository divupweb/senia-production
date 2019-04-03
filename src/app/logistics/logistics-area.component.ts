import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService, AuthService } from '../services';
import { UserMenuService } from '../shared';


@Component({
  selector: 'logistics-area',
  styleUrls: [ 'logistics-area.scss' ],
  templateUrl: './logistics-area.html'
})

export class LogisticsAreaComponent {
  constructor(private  _state: AppStateService,
              private _router: Router,
              private userMenu: UserMenuService,
              private auth: AuthService) { }
}
