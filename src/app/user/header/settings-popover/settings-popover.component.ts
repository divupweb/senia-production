import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserSettingsApiService } from "app/user/services/";
import { AppStateService, ToastService } from "app/services/";
import { CreditCard } from 'app/shared/components/credit-card';
import { Paypal } from 'app/shared/components/paypal';
import { TranslateService } from "@ngx-translate/core";
import { MenuItemService } from "app/user/menu/menu-item";
import { Subsidy } from "app/user/models";
import { CurrencyFormatPipe } from 'app/pipes/currency';

@Component({
  selector: 'settings-popover',
  providers: [CurrencyFormatPipe],
  templateUrl: 'settings-popover.html',
  styleUrls: ['settings-popover.scss'],
})
export class SettingsPopoverComponent {

  public company: any = {};
  public user: any = {};
  public subsidies: any[];
  public settings: any = {};
  public creditCard: any;
  public paypal: any;
  cardUpdateMessageDisplay = false;
  highlightPayment = false;
  @Output()
  public onSave: EventEmitter<any> = new EventEmitter();
  public show;
  private loaded = false;

  constructor(protected api: UserSettingsApiService,
              protected state: AppStateService,
              private cc: CreditCard,
              private pp: Paypal,
              private toastService: ToastService,
              protected translate: TranslateService,
              private emitter: MenuItemService,
              private currencyFormat: CurrencyFormatPipe) {
    this.company = state.currentCompany();
    this.user = state.currentUser();
    if (this.user.active_subsidies) {
      this.subsidies = this.user.active_subsidies
                                .map((s) => new Subsidy(s, translate, currencyFormat))
                                .filter((s) => s.enabled());
    }
    this.subscribeToCardUpdate();
    this.subscribeToPaypalUpdate();
    this.subscribeToPaymentRequest()
  }

  open() {
    setTimeout(() => {
      this.show = true;
      if (!this.loaded) {
        this.load();
      }
    }, 50)
  }

  close() {
    this.show = false
  }

  private load() {
    this.loaded = true;
    this.api.get().subscribe((data) => {
      this.settings = data.settings;
      this.creditCard = data.credit_card;
      this.paypal = data.paypal;
    });
  }

  public save(): void {
    this.api.update({
      allergy_ids: this.user.allergy_ids,
      employee_settings_attributes: this.settings,
    }).subscribe((data) => this.onSave.emit(data));
  }

  editCard() {
    this.cc.openNets();
    this.cardUpdateMessageDisplay = true;
  }

  editPaypal() {
    this.pp.openPaypal();
  }

  private subscribeToCardUpdate() {
    this.cc.ccEmitted$.subscribe(
      (creditCard) => {
        if (_.isObject(creditCard)) {
          this.creditCard = creditCard;
          if (this.cardUpdateMessageDisplay) {
            this.toastService.success(this.translate.instant('TOAST.SUCCESS.CARD_SAVED'))
          }
        } else {
          this.toastService.error(creditCard)
        }
      },
      (error) => this.toastService.error(error)
    )
  }

  private subscribeToPaypalUpdate() {
    this.pp.paypalEmitted$.subscribe(
      (message) => {
        if (_.isObject(message)) {
          this.paypal = message.paypal;
          this.toastService.success(this.translate.instant('TOAST.SUCCESS.PAYPAL_SAVED'))
        } else {
          this.toastService.error(message)
        }
      },
      (error) => this.toastService.error(error)
    )
  }

  private subscribeToPaymentRequest() {
    this.emitter.paymentRequested$.subscribe(
      () => {
        this.open();
        this.highlightPayment = true
        setTimeout(() => this.highlightPayment = false, 10000);
      }
    )
  }
}
