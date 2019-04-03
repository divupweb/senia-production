import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { HeaderService } from "app/user/header";
import { Deadline } from 'app/company/group-orders/shared/deadline';

@Component({
  selector: 'user-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public basket: any;
  public showCart: boolean = false;

  @Output()
  public onItemChange: EventEmitter<any> = new EventEmitter();
  public visibleItems: any[] = [];

  protected deadline: Deadline;

  constructor(protected headerService: HeaderService) {}

  ngOnInit() {
    this.headerService.basketUpdate$.subscribe((basketInfo) => {
      this.basket = _.cloneDeep(basketInfo);
      this.setVisibleItems();
      this.setDeadline();
    });
  }

  public setVisibleItems(): void {
    this.visibleItems = _.filter(_(this.basket).get('items', []), (i) => i.quantity > 0);
  }

  public show(): void {
    this.setVisibleItems();
    this.showCart = true;
  }

  public close(): void {
    this.showCart = false;
  }

  public toggle(): void {
    this.showCart ? this.close() : this.show();
  }

  public onAmountChange(cartItem: any): void {
    if (!_(this.visibleItems).filter((i) => i.quantity > 0).size()) {
      this.close();
    }
    this.onItemChange.emit(cartItem);
  }

  public locked(): boolean {
    return this.passed();
  }

  public passed(): boolean {
    return !this.deadline || this.deadline.passed;
  }

  public soon(): boolean {
    return this.deadline && this.deadline.soon;
  }

  public clearAll(): void {
    _(this.visibleItems).each((item) => {
      if (!new Deadline(item.deadline).passed) {
        item.quantity = 0;
        this.onItemChange.emit(item);
      }
    })
  }

  protected setDeadline(): void {
   const deadline = _(this.visibleItems).map('deadline').max();
   this.deadline = new Deadline(deadline);
  }

}
