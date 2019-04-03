import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'sorting',
  styleUrls: ['sorting.scss'],
  templateUrl: './sorting.html'
})

export class SortingComponent {
  _direction = true;

  @Input()
  set direction(direction: string) {
    this._direction = direction.toString().toLowerCase() == 'asc';
  }
  get direction() {
    return this._direction ? 'asc' : 'desc';
  }

  @Input() active;
  @Input() column;
  @Output() onChange = new EventEmitter();

  constructor() {}

  setActive() {
    this.active = true;
    this.direction = 'asc';
    this.sendChange();
  }

  changeDirection() {
    this._direction = !this._direction;
    this.sendChange();
  }

  private sendChange() {
    var state = {
      active: this.active,
      direction: this.direction,
      column: this.column
    }

    this.onChange.emit(state);
  }
}
