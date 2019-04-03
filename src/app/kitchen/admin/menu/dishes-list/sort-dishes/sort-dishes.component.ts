import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sort-dishes',
  templateUrl: './sort-dishes.html',
  styleUrls: ['sort-dishes.scss']
})

export class SortDishesComponent {
  @Output() onSelect = new EventEmitter();
  show = false;

  items = [
    {
      id: 'name',
      name: 'SORT.BY_NAME',
      params: { columns: ['name'], order: ['asc'] }
    },
    {
      id: 'date',
      name: 'SORT.BY_CREATION_DATE',
      params: { columns: ['created_at'], order: ['asc'] }
    }
  ];

  active = this.items[0];

  onSortSelect(item) {
    this.active = item;
    this.show = false;
    this.onSelect.emit(item.params);
  }

  open() {
    setTimeout(() => this.show = true, 100);
  }

  close() {
    this.show = false;
  }
}
