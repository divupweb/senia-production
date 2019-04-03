import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'allergies-popup',
  encapsulation: ViewEncapsulation.None,
  templateUrl:'./allergies-popup.html',
  styleUrls: ['allergies-popup.scss'],
})

export class AllergiesPopupComponent {
  showValue = false;
  @Input() allergies = [];
  @Input() selected = [];

  @Input()
  get show() {
    return this.showValue;
  }
  set show(val) {
    this.showValue = val;
    this.showChange.emit(this.showValue);
  }
  @Output() showChange = new EventEmitter();

  @Output() onSave = new EventEmitter();

  constructor() {}


  toggleAllergy(allergy) {
    var index = this.selected.indexOf(allergy.id);

    if (index > -1) {
      this.selected.splice(index, 1)
    } else {
      this.selected.push(allergy.id)
    }
  }

  activeAllergy(allergy) {
    return this.selected.indexOf(allergy.id) > -1;
  }

  cancelPopup() {
    this.show = false;
  }

  save() {
    this.show = false;
    this.onSave.emit(this.selected);
  }
}
