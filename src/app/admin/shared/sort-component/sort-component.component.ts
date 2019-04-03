import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'sort-component',
  styleUrls: ['sort-component.component.scss'],
  templateUrl: './sort-component.component.html',
})

export class SortComponent {
  isOpened: boolean = false;
  @Input() sortOrder: any = {};
  @Output() onSelect = new EventEmitter();

  @Input() items = [];

  open() {
    this.isOpened = true;
  }

  close(event = null) {
    this.isOpened = false;
  }

  select(item) {
    let column = item.column || item.name.toLowerCase();;
    this.onSelect.emit({ column: column });
    this.close();
  }

  isActive(item) {
    return item.column === this.sortOrder.column;
  }
}
