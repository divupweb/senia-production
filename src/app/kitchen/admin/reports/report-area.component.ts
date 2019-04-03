import { Component } from '@angular/core';
import { ToastService, WindowWidth } from "../../../services";
import { Router, ActivatedRoute } from '@angular/router'
import { KitchenSubscriptionProxy, KitchenDishCategoriesProxy } from "../../shared/proxy/";
import { DishCategoriesApiService } from "../../services/";
import { KitchenReportApiService } from './shared';


@Component({
  selector: 'report-area',
  templateUrl: './report-area.html',
  providers: [
    DishCategoriesApiService,
    KitchenSubscriptionProxy,
    KitchenDishCategoriesProxy,
    KitchenReportApiService,
    WindowWidth
  ]
})

export class ReportAreaComponent {
  public subscriptions: any[];
  public selectedLink;
  constructor(private subscriptionsService: KitchenSubscriptionProxy,
              private categoriesService: KitchenDishCategoriesProxy,
              public width: WindowWidth,
              private router: Router,
              private route: ActivatedRoute,
              private toastService: ToastService) {
    this.subscriptionsService.getAll().subscribe(
      (subscriptions) => {
        this.subscriptions = _.map(subscriptions, 'subscription_type');
        this.selectedLink = this.subscriptions[0];
      },
      (error) => this.toastService.error(error)
    );
    this.categoriesService.getAll();
  }
  goTo(link) {
    this.selectedLink = link.toLowerCase();
    this.router.navigate([link.toLowerCase()], { relativeTo: this.route });
  }
}
