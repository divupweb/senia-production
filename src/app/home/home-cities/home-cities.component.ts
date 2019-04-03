import { Component, OnInit } from '@angular/core'
import { AccountsProxy } from 'app/services';
import {LoginFormRequestService} from "app/home/shared";

@Component({
  selector: 'home-cities',
  styleUrls: [ 'home-cities.scss', '../home.scss'],
  templateUrl: './home-cities.html'
})

export class HomeCitiesComponent implements OnInit {
  public map;
  regions = [];

  constructor(private accounts: AccountsProxy, public loginForm: LoginFormRequestService) {}

  ngOnInit() {
    this.loadRegions();
  }

  private loadRegions() {
    this.accounts.getAll().subscribe(
      (data) => {
        this.regions = data;
      }
    )
  }

  public inView(event): void {
    if (event.value) {
      event.target.classList.add('animated');
    }
  }
}
