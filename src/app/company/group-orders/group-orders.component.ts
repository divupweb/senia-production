import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { WindowWidth } from "app/services";
@Component({
  selector: 'group-orders',
  templateUrl: './group-orders.html',
  providers: [WindowWidth]
})

export class GroupOrdersComponent {
  public subscriptions: any[];
  public selectedLink = 'orders';
  constructor(public width: WindowWidth,
              private router: Router,
              private route: ActivatedRoute) {}

  goTo(link) {
    this.selectedLink = link;
    this.router.navigate([link], { relativeTo: this.route });
  }
}
