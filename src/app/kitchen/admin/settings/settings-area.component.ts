import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { KitchenSubscriptionProxy, KitchenDishCategoriesProxy } from "../../shared/proxy/";
import { ToastService, WindowRef, WindowWidth } from "app/services";
import {
  KitchenDeadlinesApiService,
  KitchenSettingsApiService,
  KitchenLogoChangedService,
  KitchenChefImagesApiService,
  KitchenImagesApiService,
  UsersApiService,
} from "../../services/";


@Component({
  selector: 'settings-area',
  templateUrl: './settings-area.html',
  providers: [
    KitchenSubscriptionProxy,
    KitchenDishCategoriesProxy,
    KitchenDeadlinesApiService,
    KitchenSettingsApiService,
    KitchenImagesApiService,
    KitchenChefImagesApiService,
    KitchenLogoChangedService,
    UsersApiService,
    WindowWidth
  ]
})

export class SettingsAreaComponent {
  public subscriptions: any[];
  public selectedLink = 'general';
  constructor(private subscriptionsService: KitchenSubscriptionProxy,
              private categoriesService: KitchenDishCategoriesProxy,
              private toastService: ToastService,
              public width: WindowWidth,
              private router: Router,
              private route: ActivatedRoute) {

    this.subscriptionsService.getAll().subscribe(
      (subscriptions) => this.subscriptions = _.map(subscriptions, 'subscription_type'),
      (error) => this.toastService.error(error)
    );
    this.categoriesService.getAll();
  }

  goTo(link) {
    this.selectedLink = link;
    this.router.navigate([link], { relativeTo: this.route });
  }
}
