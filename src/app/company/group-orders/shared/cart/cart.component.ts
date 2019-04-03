import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {Deadline} from "app/company/group-orders";

@Component({
  selector: 'cart',
  styleUrls: ['cart.scss'],
  templateUrl: './cart.html'
})

export class CartComponent implements OnChanges {
  @Input() items = [];
  @Output() onCartChange = new EventEmitter();
  @Output() onCartRemove = new EventEmitter();

  public groupedItems: any[] = [];
  public deadlines: Deadline[] = [];

  public kitchenGroup = (cartItem) => cartItem.information.kitchen.name;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.groupedItems = _.chain(this.items).groupBy(this.kitchenGroup).values().value();
      this.deadlines = _.map(this.groupedItems, (items: any[]) => new Deadline(_.chain(items).first().get(['information', 'deadline']).value()));
    }
  }

  onItemChange(item) {
    this.onCartChange.emit(item);
  }

  onItemRemove(item) {
    this.onCartRemove.emit(item);
  }
}
