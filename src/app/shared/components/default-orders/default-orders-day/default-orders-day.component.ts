import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'default-orders-day',
  styleUrls: ['default-orders-day.scss'],
  templateUrl: './default-orders-day.html'
})

export class DefaultOrdersDayComponent {
  @Input() item;
  @Input() popup;
  @Output() onChange = new EventEmitter();

  ngOnInit() {
    this.popup.onSave.subscribe(
      (event) => this.onChange.emit(event)
    )
  }

  edit() {
    this.popup.open(this.item);
  }
}
