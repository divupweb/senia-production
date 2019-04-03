import { Component, Input } from '@angular/core';

@Component({
  selector: 'default-order-item',
  styleUrls: ['default-order-item.scss'],
  templateUrl: './default-order-item.html'
})

export class DefaultOrderItemComponent {
  @Input() item;
}
