import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreditCard } from 'app/shared'
import { ToastService } from 'app/services';
import {
  UserStateService,
  UserSettingsApiService,
  DishApiService
} from 'app/user/services'
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'dish-info-popup',
  providers: [DishApiService],
  styleUrls: ['dish-info-popup.scss'],
  templateUrl: './dish-info-popup.html'
})

export class DishInfoPopupComponent {
  @Input() user;

  @Input()
  public date: string;

  @Input()
  public showButtons: string;

  @Input()
  public subscription: string;

  @Output()
  public onConfirm: EventEmitter<any> = new EventEmitter();

  @Output()
  public onPeriodicSet: EventEmitter<any> = new EventEmitter();

  @Output()
  public onSettingsChange: EventEmitter<any> = new EventEmitter();

  public menuItem: any = {};
  public state: boolean = false;
  public components: any[];
  public allergicComponents: any[];
  public periodic: boolean = false;


  public constructor(protected api: DishApiService,
                     private cc: CreditCard,
                     private userSettings: UserSettingsApiService,
                     private userState: UserStateService,
                     private toastService: ToastService,
                     protected translate: TranslateService) {}


  public show(): void {
    this.state = true;
  }
  public close(): void {
    this.state = false;
  }

  public apply(item: any): DishInfoPopupComponent {
    this.menuItem = _.cloneDeep(item);
    this.periodic = this.menuItem.periodic;
    this.initComponents();
    return this;
  }

  public isAllergic(allergiesIds: number[], ingredient: any): boolean {
    return _.some(allergiesIds, (i) => _.includes(ingredient.allergy_ids, i));
  }

  catchCard(fn) {
    if (!this.user.canEdit) {
      this.cc.openNets();
      this.cc.ccEmitted$.subscribe(
        () => {
          this.userSettings.get().subscribe(
            () => {
              this.setUserState();
              this.setShowButtons();
              this.toastService.success(this.translate.instant('TOAST.SUCCESS.CARD_SAVED'));
              this.onSettingsChange.emit(this.user);
              this.catchCard(fn);
            },
            () => this.toastService.error(this.translate.instant('TOAST.ERROR.UNABLE_TO_GET_USER')))
        },
        (error) => this.toastService.error(error)
      )
    } else {
      fn.apply(this);
    }
  }

  private setUserState() {
    this.user.active = this.userState.active();
    this.user.canEdit = this.userState.canEdit();
  }

  private setShowButtons() {
    const buttonsAvailable = this.menuItem && !this.menuItem.deadlinePassed;
    this.showButtons = buttonsAvailable && this.user.active && this.user.canEdit;
  }

  public decQuantity() {
    if (this.menuItem.quantity > 0) {
      this.menuItem.quantity--;
    }
  }

  public incQuantity() {
    this.menuItem.quantity++;
  }

  public setPeriodic(): void {
    this.api.setPeriodic(this.menuItem.id, this.subscription, moment(this.date).isoWeekday() - 1).subscribe(() => {
      if (this.menuItem.quantity == 0) this.incQuantity();
      this.menuItem.periodic = true;
      this.onPeriodicSet.emit(this.menuItem);
      this.toastService.success(this.translate.instant('TOAST.SUCCESS.ADDED_TO_DEFAULTS'));
    }, (error) => this.toastService.error(error));
  }

  protected initComponents() {
    this.components = [];
    this.allergicComponents = [];
    const allergiesIds = _(this.menuItem.userAllergies).map('id').value();
    const dishComponents = _(this.menuItem).get('_category.dish.dish_components', []);
    _.each(dishComponents, (component) => {
      if (this.isAllergic(allergiesIds, component.ingredient)) {
        component.allergic = true;
        this.allergicComponents.push(component);
      } else {
        component.allergic = false;
      }

      this.components.push(component)
    })
  }
}
