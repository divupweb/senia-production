import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'set-menu-item',
  templateUrl: './set-menu-item.component.html',
  styleUrls: ['./set-menu-item.component.scss']
})
export class SetMenuItemComponent {
  weekDays = moment.weekdaysMin().slice(1, 6);
  @Input() item;
  @Output() onChange = new EventEmitter();

  setWholeWeek(event) {
    event.stopPropagation();
    this.item.days.filter((e) => !e.passed).forEach((e) => this.onDayChange(e, true));
  }

  onDayChange(item, event) {
    this.onChange.emit({ day: item.day, value: event, item: this.item });
  }
}
