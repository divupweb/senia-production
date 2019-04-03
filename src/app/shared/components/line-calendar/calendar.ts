export abstract class Calendar {
  selectedDays = [];
  daysShown = [];
  showPicker = false;
  weekly = false;
  showCalendarIcons = true;
  showMonth = true;
  daysCanBePassed: boolean = true;
  monthShown;
  calendarDate;

  ngOnInit() {
    this.backToday()
  }

  isSelected(date) {
    return !!_.find(this.selectedDays, { date });
  }

  dateCalendarPicked() {
    this.showPicker = false;
    this.selectDay(this.calendarDate);
  }

  selectDay(date) {/** do nothing */}
  backToday() {/** do nothing */}
  scrollDates(direction) {/** do nothing */}

  isWeekend(weekday) {
    return _.includes([6,7], weekday);
  }

  buildDay(day) {
    let date = day || moment();
    let weekDay = date.format("ddd");
    return {
      number:  date.date(),
      date:    date.format("YYYY/MM/DD"),
      iso_date: date.toISOString(),
      month:   date.format('MMMM'),
      weekday: weekDay,
      weekend: this.isWeekend(date.isoWeekday()),
      disabled: false,
      moment: date
    }
  }

  resetDays() {
    this.selectedDays = [];
    this.daysShown = [];
  }

  emitDays() {
    let dates = this.daysMap(this.selectedDays);
    (this as any).daySelect.emit(dates);
  }

  daysMap(days) {
    return _.map(days, (d: any) => d.moment);
  }

  setMonthTitle(): void {
    this.monthShown = _.uniq([_.first(this.daysShown).month, _.last(this.daysShown).month]).join(' - ');
  }
}
