import { Component, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'order-popover',
  templateUrl:'./order-popover.html',
  styleUrls: ['order-popover.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderPopoverComponent {
  @Input() basket;
}
