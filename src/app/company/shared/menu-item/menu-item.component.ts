import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppStateService } from "app/services";
import { CompanyUpdateService } from 'app/company/services';

@Component({
  selector: 'menu-item',
  styleUrls: ['menu-item.scss'],
  templateUrl: './menu-item.html'
})

export class MenuItemComponent {
  @Input() item: any = {};
  @Input() deadline;
  @Input() disabled = false;
  @Output() onAddToCard = new EventEmitter();
  canEditOrders = false;

  constructor(
    private state: AppStateService,
    private companyUpdate: CompanyUpdateService) { }

  ngOnInit() {
    this.checkEditState();
    this.companyUpdate.update.subscribe(
      (data) => {
        this.checkEditState(data)
      }
    )
  }

  ngOnChanges(changes) {
    if (changes['item']) this.item.checkAddedStatus();
  }

  addToCart() {
    if (!this.canEditOrders) {
      this.showPopup();
      return;
    }
    if (this.item.amount <= 0) return;

    this.onAddToCard.emit(this.item);
  }

  private checkEditState(company = this.state.currentCompany()) {
    this.canEditOrders = !!company && company.can_edit_orders == true;
  }

  private showPopup() {
    this.companyUpdate.showWelcomePopup();
  }
}
