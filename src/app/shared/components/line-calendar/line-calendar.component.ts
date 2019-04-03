import { Component, Output, EventEmitter } from '@angular/core';
import { Calendar } from './calendar';


@Component({
  selector: 'line-calendar',
  styleUrls:  ['line-calendar.scss'],
  templateUrl: './line-calendar.html'
})

export class LineCalendarComponent extends Calendar {
  @Output() daySelect = new EventEmitter();

  backToday() {
    this.resetDays()
    this.selectedDays = this.buildDays(0)
    this.buildDaysShown();
    this.emitDays();
  }

  selectDay(date) {
    if (this.selectedDays[0].date === date) return;
    var momentDate = moment(date)
    if (this.isWeekend(momentDate.format("ddd"))) {
      date = momentDate.isoWeekday(5).format("YYYY/MM/DD");
    }
    this.selectedDays = this.buildDays(0, null, date);
    this.buildDaysShown();
    this.emitDays()
  }

  private buildDaysShown() {
    var range = [-3, 5];
    if (this.selectedDays.length > 2) range = [-2, 6];
    this.daysShown = this.buildDays.apply(this, range)
    this.setMonthTitle();
  }

  scrollDates(direction) {
    if (direction == 'forward') this.daysShown = this.buildDays(3, 11, this.daysShown[3].date)
    else this.daysShown = this.buildDays(-9, -1, this.daysShown[3].date)
    this.setMonthTitle();
  }

  private

  buildDays(rangeStart,  rangeEnd = null, newDate = null) {
    let selected;
    if (newDate) {
      selected = moment(newDate);
    } else if (this.selectedDays[0]) {
      selected = moment(this.selectedDays[0].date);
    } else {
      selected = moment();
    }
    if (!rangeEnd) {
      rangeEnd = selected.format('ddd') == 'Fri' ? 4 : 2; // rangeEnd not passed for building selected dates which could include weekend days
    }
    return _.map(_.range(rangeStart, rangeEnd), (d) => {
      let day = _.cloneDeep(selected)
      return this.buildDay(day.add(d, 'days'))
    })
  }
}
