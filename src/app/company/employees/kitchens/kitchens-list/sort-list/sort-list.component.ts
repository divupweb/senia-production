import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sort-list',
  templateUrl: './sort-list.html',
  styleUrls: ['sort-list.scss']
})

export class SortListComponent {
  @Output() onSelect = new EventEmitter;
  show = false;

  items = [
    {
      id: 'date',
      name: 'SORT.BY_DATE'
    },
    {
      id: 'rating',
      name: 'SORT.BY_RATING'
    },
    {
      id: 'priceAsc',
      name: 'SORT.BY_PRICE_ASC'
    },
    {
      id: 'priceDesc',
      name: 'SORT.BY_PRICE_DESC'
    }
  ];

  active = this.items[0];

  onSortSelect(item) {
    this.active = item;
    this.show = false;
    this.onSelect.emit(item.id);
  }

  open() {
    setTimeout(() => this.show = true, 100);
  }

  close() {
    this.show = false;
  }
}
