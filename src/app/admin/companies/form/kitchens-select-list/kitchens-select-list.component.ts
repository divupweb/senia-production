import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'kitchens-select-list',
  templateUrl: './kitchens-select-list.component.html',
  styleUrls: ['./kitchens-select-list.component.scss']
})
export class KitchensSelectListComponent  {
  search = '';
  @Input() kitchens = [];
  @Output() onSelect = new EventEmitter();

  constructor() { }

  close($event) {
    this.onSelect.emit(null);
  }

  select(item) {
    this.onSelect.emit(item);
  }
}
