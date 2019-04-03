import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'kitchens-list',
  styleUrls: ['kitchens-list.scss'],
  templateUrl: './kitchens-list.html'
})
export class KitchensListComponent {
  @Input() kitchens = {};
  @Input() subscriptions = [];
  @Output() onSelect = new EventEmitter;
  @Output() onUpdate = new EventEmitter;
  selectedKitchens = [];
  selectedSort = 'date';

  constructor() {  }

  ngOnChanges(changes) {
    this.updateKitchens();
  }

  onKitchenSelect(item) {
    this.onSelect.emit(item);
  }

  updateKitchens() {
    let subs = this.selectedSubscriptions();
    let items = this.flattenKitchens(subs);
    this.selectedKitchens = this.sortKitchens(items);
    this.onUpdate.emit(true);
  }

  private selectedSubscriptions() {
    return this.subscriptions
               .filter(e => e.selectActive)
               .map(e => e.subscription_type);
  }

  private flattenKitchens(filter) {
    return _.chain(this.kitchens)
            .filter((list, k) => -1 < filter.indexOf(k))
            .flatten()
            .uniqBy('id')
            .value();
  }

  onSortSelect(id) {
    this.selectedSort = id;
    this.selectedKitchens = this.sortKitchens(this.selectedKitchens);
  }

  private sortKitchens(items) {
    if (items.length == 0) return items;
    let column;
    let direction = 'asc';

    switch (this.selectedSort)
    {
      case 'priceAsc':
        column = 'price';
        break;
      case 'priceDesc':
        column = 'price';
        direction = 'desc'
        break;
      case 'rating':
        column = 'rating';
        break;
      default:
        direction = 'desc'
        column = 'created_at';
    }

    return _.orderBy(items, [column], [direction])
  }
}
