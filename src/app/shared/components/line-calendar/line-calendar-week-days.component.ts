import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Calendar } from './calendar';


@Component({
  selector: 'line-calendar-week-days',
  styleUrls:  ['line-calendar.scss'],
  templateUrl: './line-calendar.html'
})

export class LineCalendarWeekDaysComponent extends Calendar {
  @Input() daysInfo = {};
  @Output() daySelect = new EventEmitter();

  weekly = true;
  showCalendarIcons = false;
  showMonth = false;
  selectedDay;
  daysCanBePassed: boolean = false;

  isSelected(date) {
    return this.selectedDay == date
  }

  ngOnChanges(changes) {
    if (changes['daysInfo']) this.fillDaysInfo();
  }

  ngOnInit() {
    this.buildDaysShow();
    this.selectDay();
  }

  selectDay(day = moment().isoWeekday() - 1, disabled = false) {
    if (disabled || this.selectedDay == day) return;
    this.setDay(day);
  }

  private setDay(day) {
    this.selectedDay  = day;
    this.emitDays();
  }

  private buildDaysShow() {
    this.daysShown = this.buildDays();
    this.fillDaysInfo();
  }

  private buildDays() {
    var dates = [];
    for(let day = 0; day <= 6; day++) {
      let date = this.buildDay(day);
      dates.push(date);
    }
    return dates;
  }

  buildDay(day) {
    let date = moment().isoWeekday(day + 1);
    let weekDay = date.format("ddd")
    let isWeekend = this.isWeekend(weekDay);
    return {
      number:  weekDay,
      weekday: null,
      weekend: isWeekend,
      date:    day,
      iso_date: date.toISOString(),
      month:   null,
      disabled: isWeekend,
      moment: date
    }
  }

  private fillDaysInfo() {
    this.daysShown.forEach( e => {
      e.info = this.daysInfo[e.date]
    });
  }

  emitDays() {
    this.daySelect.emit(this.selectedDay);
  }
}
