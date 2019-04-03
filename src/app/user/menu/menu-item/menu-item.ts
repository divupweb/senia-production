import { Component, Input, Output, EventEmitter, SimpleChange, ViewChild } from '@angular/core';
import { RatingPopupComponent, DishInfoPopupComponent, MenuItemPopoverComponent } from "app/user/menu/";
import { CreditCard, Paypal } from 'app/shared';
import {
  UserStateService,
  UserSettingsApiService
} from 'app/user/services';
import { ToastService } from "app/services";
import {TranslateService} from "@ngx-translate/core";
import { MenuItemService} from "./menu-item.service"
@Component({
  selector: 'menu-item',
  styleUrls: ['menu-item.scss'],
  templateUrl: './menu-item.html'
})

export class MenuItemComponent {
  @Input() menuItem: any = {};
  @Input() day: string;
  @Input() date: string;
  @Input() subscription: string;
  @Input() user;
  @Input() customClass = {};

  @Output() onChange = new EventEmitter();
  @Output() onPeriodicSet = new EventEmitter();

  @ViewChild('info')
  public info: DishInfoPopupComponent;

  @ViewChild('confirmation')
  public confirmation: MenuItemPopoverComponent;

  @ViewChild('rating')
  public rating: RatingPopupComponent;

  public onGoingChanges;
  public confirmationTimeout = 750;
  savedAmount = null;
  showButtons = false;
  public active: boolean = false;
  callback;

  constructor(private emitter: MenuItemService,
              private userSettings: UserSettingsApiService,
              private toastService: ToastService,
              private userState: UserStateService,
              protected translate: TranslateService,
              private cc: CreditCard,
              private pp: Paypal
  ) {
    this.subscribeToCardUpdate();
    this.subscribeToPaypalUpdate();
  }

  public ngOnChanges(changes: {[propName: string]: SimpleChange}): void {
    if(changes['menuItem']) {
      this.savedAmount = this.menuItem.quantity;
      this.setUserState();
    }
    this.setShowButtons();
  }

  catchCard(fn) {
    if (!this.user.canEdit) {
      this.emitter.emitPaymentRequest();
      this.callback = fn;
    } else {
      fn.apply(this);
    }
  }

  private subscribeToCardUpdate() {
    this.cc.ccEmitted$.subscribe(
      () => {
        this.handlePaymentUpdate('TOAST.SUCCESS.CARD_SAVED')
      },
      (error) => this.toastService.error(error)
    )
  }

  private subscribeToPaypalUpdate() {
    this.pp.paypalEmitted$.subscribe(
      () => {
        this.handlePaymentUpdate('TOAST.SUCCESS.PAYPAL_SAVED')
      },
      (error) => this.toastService.error(error)
    )
  }

  private handlePaymentUpdate(key) {
    this.userSettings.get().subscribe(
      () => {
        this.user = this.userState.getUser();
        this.setUserState();
        this.setShowButtons();

        if (this.callback) {
          this.toastService.success(this.translate.instant(key));
          this.catchCard(this.callback)
        }
      },
      () => { this.toastService.error(this.translate.instant('TOAST.ERROR.UNABLE_TO_GET_USER')) })
  }

  private setUserState() {
    this.user.active = this.userState.active();
    this.user.canEdit = this.userState.canEdit();
  }

  public decQuantity(): void {
    if (this.menuItem.quantity > 0) {
      this.menuItem.quantity--;
    }
    this.showConfirmation();
  }

  public incQuantity(): void {
    this.menuItem.quantity++;
    this.showConfirmation();
  }

  onSettingsChange(user) {
    this.user = user;
    this.setUserState();
  }

  public showConfirmation(): void  {
    clearTimeout(this.onGoingChanges);
    this.onGoingChanges = setTimeout(() => {
      this.active = true;
      this.confirmation.show();
    }, this.confirmationTimeout);
  }

  public confirm(): void  {
    this.active = false;
    this.createOrUpdate(this.menuItem);
  }

  public popupConfirm(menuItem: any): void {
    this.createOrUpdate(menuItem);
  }

  public periodicSet(menuItem: any): void {
    _.merge(this.menuItem, menuItem);
    this.onPeriodicSet.emit({
      id: menuItem.id,
      quantity: menuItem.quantity,
      price: menuItem.maxPrice,
      category: menuItem._category,
      periodic: menuItem.periodic,
      itemPrice: menuItem.price
    });
  }

  public cancel(): void {
    this.active = false;
    this.menuItem.quantity = this.savedAmount;
    this.callback = null;
  }

  public createOrUpdate(menuItem: any): void {
    const event = {
      menuItem,
      callback: () => {
        this.info.close();
        this.savedAmount = menuItem.quantity;
        this.menuItem.quantity = this.savedAmount;
      },
    };
    this.onChange.emit(event);
  }

  private setShowButtons() {
    const buttonsAvailable = this.menuItem && !this.menuItem.deadlinePassed;
    this.showButtons = buttonsAvailable && this.user.active;
  }
}
