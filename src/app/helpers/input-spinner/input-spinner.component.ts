import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'input-spinner',
  styleUrls: ['input-spinner.scss'],
  templateUrl: './input-spinner.html'
})

export class InputSpinnerComponent {
  @Input() value;
  @Input() disabled = false;
  @Output() inputChange = new EventEmitter();

  constructor() { }

  onChangeInput(event) {
    this.value = event;
    this.inputChange.emit({value: event});
  }

  increaseValue() {
    if(!this.disabled) {
      this.onChangeInput(this.value+1);
    }
  }

  decreaseValue() {
    if(!this.disabled && this.value) {
      this.onChangeInput(this.value-1);
    }
  }
}
