import { Component } from '@angular/core';
import { WindowWidth } from "app/services";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'company-settings',
  templateUrl: './company-settings.html',
  providers: [
    WindowWidth
  ]
})
export class CompanySettingsComponent {
  public subscriptions: any[];
  public selectedLink = 'info';
  constructor(public width: WindowWidth,
              private router: Router,
              private route: ActivatedRoute) {}
  goTo(link) {
    this.selectedLink = link;
    this.router.navigate([link], { relativeTo: this.route });
  }
}
