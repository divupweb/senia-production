import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'company-kitchens',
  templateUrl: './company-kitchens.html',
  styleUrls: ['company-kitchens.scss']
})

export class CompanyKitchensComponent {
  search = '';
  @Input() kitchens = [];
  @Output() onChange = new EventEmitter();

  private select(kitchen) {
    this.onChange.emit([kitchen.id, kitchen.selected]);
  }

  toggle(kitchen) {
    kitchen.selected = !kitchen.selected;
    this.select(kitchen);
  }
}
