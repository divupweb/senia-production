import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Calendar } from './calendar';


@Component({
  selector: 'line-calendar-weekly',
  styleUrls: ['line-calendar.scss'],
  templateUrl: './line-calendar.html'
})

export class LineCalendarWeeklyComponent extends Calendar {
  @Input() daysInfo = {};
  @Input() disableWeekend = true;
  @Input() startDay;
  @Output() weekChange = new EventEmitter();
  @Output() daySelect = new EventEmitter();
  weekly = true;
  public showMonth: boolean = true;

  ngOnChanges(changes) {
    if (changes['daysInfo']) this.fillDaysInfo();
    if (changes['disableWeekend']) this.changeDisableState();
  }

  ngOnInit() {
    let date;
    if (this.startDay) {
      date = moment.utc(this.startDay);
    } else {
      date = moment();
    }
    this.selectDay(date);
  }

  backToday() {
    this.selectDay();
  }

  selectedDay;
  set selectedDays(value) {
    this.selectedDay = value[0];
  }
  get selectedDays() {
    return [this.selectedDay];
  }

  selectDay(date = moment(), disabled = false) {
    if (disabled || (this.selectedDay && this.selectedDay.date == date)) return;
    this.resetDays()
    this.setDay(date);
    this.emitDays();
    var dateMoment = this.toMoment(this.selectedDay.date);
    this.buildDaysShow(dateMoment);
  }

  emitDays() {
    let dates = this.daysMap(this.selectedDays);
    (this as any).daySelect.emit(dates[0]);
  }

  private setDay(date = moment()) {
    var day;
    if (typeof date === 'string' || date instanceof String) {
      day = this.toMoment(date);
    } else if (moment.isMoment(date)) {
      day = date;
    } else {
      day = moment(date);
    }

    this.selectedDay  = this.buildDay(day);
  }

  private toMoment(str) {
    return moment.utc(str, "YYYY/MM/DD")
  }

  scrollDates(direction) {
    var directionSign = direction == 'forward' ? 1 : -1;
    var day = this.toMoment(this.daysShown[0].moment);
    var offset = 7 * directionSign;
    day.add(offset, 'days');

    this.buildDaysShow(day);
  }

  private buildDaysShow(day) {
    this.daysShown = this.buildDays(day);
    this.fillDaysInfo();
    this.emitShowDays();
    this.setMonthTitle();
  }

  private buildDays(date) {
    var dates = [];
    var firstDay = date.clone().isoWeekday(1);
    for(let i = 0; i<= 6; i++) {
      let day = firstDay.clone();
      let dayObject = this.buildDay(day.add(i, 'days'));
      if (this.disableWeekend) {
        dayObject.disabled = dayObject.weekend;
      }
      dates.push(dayObject);
    }
    return dates;
  }

  emitShowDays() {
    var dates = this.daysMap(this.daysShown);
    this.weekChange.emit(dates);
  }

  fillDaysInfo() {
    this.daysShown.forEach((e) => {
      var date = e.moment.formatUTC('YYYY-MM-DD');
      e.info = this.daysInfo[date];
    })
  }

  private changeDisableState() {
    this.daysShown.forEach((e) => this.setDayDisableState(e));
  }

  private setDayDisableState(day) {
    day.disabled = this.disableWeekend && day.weekend;
  }
}
