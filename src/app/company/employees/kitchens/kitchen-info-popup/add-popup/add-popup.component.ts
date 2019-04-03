import { Component, EventEmitter, Output, Input } from '@angular/core';


@Component({
  selector: 'add-popup',
  templateUrl: './add-popup.html',
  styleUrls: ['add-popup.scss'],
})

export class AddPopupComponent {
  @Input() activeSubscriptions;
  @Input() activeDays;
  @Output() onClose = new EventEmitter();
  @Output() onAdd = new EventEmitter();
  calendar;
  weekdays = [null].concat(moment.weekdaysMin().slice(1, 6));

  ngOnInit() {
    this.initCalendar()
  }

  private initCalendar() {
    let subscriptions = ['breakfast', 'lunch', 'dinner'];
    this.calendar = subscriptions.map((s) => { return {
      type: s,
      disabled: -1 == this.activeSubscriptions.indexOf(s),
      days: this.initDay(this.activeDays[s])
    }});
  }

  initDay(subscription) {
    return _.map(new Array(5), (e, i) => {
      let active = false;
      if (subscription) active = -1 < subscription.indexOf(i);
      return active;
    });
  };

  add() {
    this.onAdd.emit(this.calendar);
  }

  close(event) {
    if (event) event.stopPropagation();
    this.onClose.emit(false);
  }

  toggleDay(event, item, day) {
    event.stopPropagation();
    if (item.disabled) return;
    item.days[day] = !item.days[day];
  }
}
