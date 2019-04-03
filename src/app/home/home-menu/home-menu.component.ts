import {Component, ViewChild} from '@angular/core'
import { ToastService, AccountsProxy, ObjectLoader } from 'app/services';
import { HomeMenuApiService } from './home-menu-api.service';
import { LocationPopupComponent } from './location-popup';
import {ActivatedRoute} from "@angular/router";
import {LoginFormRequestService} from "app/home/shared";

@Component({
  selector: 'home-menu',
  templateUrl: './home-menu.html',
  styleUrls: ['home-menu.scss', '../home.scss'],
  providers: [HomeMenuApiService],
})

export class HomeMenuComponent {

  @ViewChild('popup')
  public popup: LocationPopupComponent;

  kitchens = [];
  accounts = [];
  menuItems = [];
  subscriptions = [];
  activeKitchenId = null;
  activeAccountId = null;
  activeSubscription = null;
  date = null;
  public currentAccount: any = {};
  public item: any = {};

  constructor(
    public loginForm: LoginFormRequestService,
    private api: HomeMenuApiService,
    private toast: ToastService,
    private accountsProxy: AccountsProxy,
    protected route: ActivatedRoute) {}

  ngOnInit() {
    this.loadAccounts();
  }

  private loadAccounts() {
    this.accountsProxy.getAll().subscribe(
      (data) => {
        this.accounts = data;
        const id = +this.route.snapshot.queryParams['account_id'];
        let current = _.find(this.accounts, { id });
        if (!current) {
          current = _.first(this.accounts);
        }
        this.onAccountChange(current);
      }
    )
  }

  updateData() {
    this.api.get(this.activeAccountId, this.activeSubscription, this.activeKitchenId).subscribe(
      (data) => {
        Object.assign(this, ObjectLoader.toCamelCase(data));
        this.kitchens = ObjectLoader.toSnakeCase(this.kitchens);
        this.item = _.find(this.kitchens, { id: this.activeKitchenId });
      },
      (error) => this.toast.error(error)
    )
  }

  onAccountChange(account) {
    if (this.activeAccountId == account.id) return;
    this.currentAccount = account;
    this.setActive(account.id);
    this.updateData();
  }

  onSubscriptionChange(subscription) {
    if (this.activeSubscription == subscription) return;
    this.setActive(this.activeAccountId, subscription);
    this.updateData();
  }

  onKitchenChange(kitchen) {
    this.item = kitchen;
    if (this.activeKitchenId == kitchen.id) return;
    this.setActive(this.activeAccountId, this.activeSubscription, kitchen.id);
    this.updateData();
  }

  private setActive(accountId = null, subscription = null, kitchenId = null) {
    this.activeAccountId = accountId;
    this.activeSubscription = subscription;
    this.activeKitchenId = kitchenId;
  }

}
