import {Injectable, EventEmitter, OnDestroy} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastService, UrlOpenable, FayeClient, AppStateService } from "app/services";
import { PaypalApiService } from "./paypal-api.service";
import { Mixin } from "app/helpers/decorators/mixin";

@Mixin([UrlOpenable])
@Injectable()
export class Paypal implements OnDestroy {
  openUrl: (url: string, focus?: boolean, tab?) => void; getTab: () => void;  openTab: () => void; closeTabs: (t?) => void;
  tab;

  public paypalEmitted$: EventEmitter<string> = new EventEmitter();
  public fayeSubscription;
  constructor(private toastService: ToastService,
              private api: PaypalApiService,
              private sanitizer: DomSanitizer,
              private faye: FayeClient,
              private state: AppStateService) {
                this.subscribePaypalUpdate();
              }
  ngOnDestroy() {
    if (this.fayeSubscription) this.fayeSubscription.cancel();
  }

  subscribePaypalUpdate() {
    const user = this.state.currentUser();
    if (user) {
      this.fayeSubscription = this.faye.client.subscribe(`/${user.id}/paypal`,
        (paypal) => {
          this.paypalEmitted$.emit(paypal);
          this.closeTab();
        }
      )
    }
    // this.fayeSubscription.then((s) => {})
  }

  openPaypal() {
    this.openTab();
    this.api.getConfirmUrl().subscribe(
      (url) => {
        this.openUrl(url)
      },
      (error) => {
        this.toastService.error(error);
        this.closeTabs();
      }
    )
  }

  closeTab() {
    if (this.tab) this.tab.close();
  }
}
