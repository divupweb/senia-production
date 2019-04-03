import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sort-mark',
  templateUrl: './sort-mark.component.html'
})
export class SortMarkComponent {
  @Input() column;
  @Input() sortOrder: any = {};

  get active() {
    return !!this.sortOrder && !!this.column && this.column === this.sortOrder.column;
  }
}
