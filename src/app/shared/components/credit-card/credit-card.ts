import { Injectable, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastService, UrlOpenable, FayeClient, AppStateService } from "app/services";
import { CreditCardApiService } from "./credit-card-api.service";
import { Mixin } from "app/helpers/decorators/mixin";

@Mixin([UrlOpenable])
@Injectable()
export class CreditCard {
  openUrl: (url: string, focus?: boolean, tab?) => void; getTab: () => void;  openTab: () => void; closeTabs: (t?) => void;
  tab;

  public ccEmitted$ = new EventEmitter();
  public fayeSubscription;
  constructor(private toastService: ToastService,
              private api: CreditCardApiService,
              private sanitizer: DomSanitizer,
              private faye: FayeClient,
              private state: AppStateService) {
                this.subscribeCreditCardUpdate();
              }

  ngOnDestroy() {
    if (this.fayeSubscription) this.fayeSubscription.cancel();
  }

  subscribeCreditCardUpdate() {
    let user = this.state.currentUser();
    if (!user) return;
    this.fayeSubscription = this.faye.client.subscribe(`/${user.id}/credit_card`,
      (message) => {
        this.emitCreditCard(message.creditCard)
        this.closeTab();
      }
    )
    // this.fayeSubscription.then((s) => {})
  }

  emitCreditCard(creditCard: any) {
    this.ccEmitted$.emit(creditCard);
  }

  openNets() {
    this.openTab();
    this.api.getRegisterUrl().subscribe(
      (response) => {
        this.openUrl(response)
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
