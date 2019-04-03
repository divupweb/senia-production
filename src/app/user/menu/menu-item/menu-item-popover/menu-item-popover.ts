import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeaderService } from "app/user/header";

@Component({
  selector: 'menu-item-popover',
  styleUrls: ['./menu-item-popover.scss'],
  templateUrl: 'menu-item-popover.html'
})

export class MenuItemPopoverComponent {

  public state: boolean = false;

  @Input()
  public menuItem: any = {};

  @Input()
  public subscription: string;

  @Input()
  public date: string|Date|any;

  @Input()
  public customClass = {};

  @Output()
  public onConfirm: EventEmitter<boolean> = new EventEmitter();

  @Output()
  public onCancel: EventEmitter<boolean> = new EventEmitter();

  public constructor(protected header: HeaderService) {}

  public confirm(): void {
    this.onConfirm.emit(true);
    this.close();
  }

  public cancel(): void {
    this.onCancel.emit(true);
    this.close();
  }

  public close(): void {
    this.state = false;
  }

  public show(): void {
    this.state = true;
  }

  public isLast(): boolean {
    let isLast = false;
    this.header.basketUpdate$.subscribe((basket) => {
      const items = _.get(basket, 'items');
      isLast = _(items).filter((o) => o.quantity > 0).size() == 1
    });
    return isLast
  }
}
