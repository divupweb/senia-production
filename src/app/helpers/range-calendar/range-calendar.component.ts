import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';


@Component({
  selector: 'range-calendar',
  styleUrls: ['range-calendar.scss'],
  templateUrl: './range-calendar.html'
})

export class RangeCalendarComponent implements OnInit {
  days = [];
  format = "DD-MM-YYYY";
  initialMonth: any;
  currentMonth: any;
  monthTitle: string;

  @Input()
  selectedStart;

  @Input()
  selectedEnd;
  range = [];
  weekDays;
  @Input()
  public clickOnDisabled: boolean = true;

  @Input()
  public disabledDays: string|Date|any[] = [];

  @Input()
  public disabledFn: (date?: any) => false;

  @Output()
  public onSelectRange = new EventEmitter();

  @Output()
  public ondDaySelect: EventEmitter<any> = new EventEmitter();

  protected initialized: boolean = false;

  constructor() {
    this.initWeekDays();
  }

  ngOnInit() {
    this.init();
    this.calculateMonth();
  }

  ngOnChanges() {
    this.init();
    this.range = [this.selectedStart, this.selectedEnd];
    this.calculateDays();
  }

  private initWeekDays() {
    let days = moment.weekdaysMin();
    days.push(days.shift());
    this.weekDays = days;
  }

  private init() {
    if (!this.initialized) {
      this.initialized = true;
    } else {
      return;
    }
    this.initialMonth = moment().startOf('month');
    this.currentMonth = _.cloneDeep(this.initialMonth);
  }

  clickDay(day) {
    if (!this.clickOnDisabled && day.disabled) {
      return;
    }
    let selected = moment(day.date, this.format);
    this.ondDaySelect.emit(selected);
    if (!this.selectedStart && !this.selectedEnd || this.selectedEnd ) {
      this.selectedStart = selected;
      this.selectedEnd = null;
      this.range = [moment(this.selectedStart, this.format), moment(this.selectedStart, this.format)]
    } else if (this.selectedStart) {
      if (selected.isBefore(this.selectedStart)) {
        this.selectedEnd = _.clone(this.selectedStart);
        this.selectedStart = selected;
      } else {
        this.selectedEnd = selected;
      }
    }
    if (this.selectedStart && this.selectedEnd) {
      this.range = [moment(this.selectedStart, this.format), moment(this.selectedEnd, this.format)];
      this.onSelectRange.emit(this.range);
    }
    this.calculateDays();
  }


  calculateMonth() {
    this.buildDays();
    this.calculateDays();
    this.monthTitle = this.currentMonth.format("MMMM, YYYY");
  }

  changeMonth(val) {
    if (val == 1) this.currentMonth.add(1, 'month');
    if (val == -1 && this.initialMonth != this.currentMonth) this.currentMonth.subtract(1, 'month');
    this.calculateMonth()
  }

  private calculateDays() {

    let contains = (range, day) => {
      return day.isBetween(range[0], range[1]);
    };

    _(this.days).each((week) => {
      _(week).each((day) => {
        day['today'] = moment().isSame(day.object);
        day['disabled'] = this.checkDisabled(day.object) || _.includes(this.disabledDays, day.date);
        day['selected'] = _(this.range).map((i) => _.invoke(i, 'isSame', day.object)).includes(true);
        day['betweenSelected'] = (this.range && contains(this.range, day.object))
      })
    })

  }

  protected buildDays(): void {
    let firstDay = _.cloneDeep(this.currentMonth).startOf('isoweek');
    for(let i = 0; i < 5; i++) {
      this.days[i] = [];
      for(let j = 0; j < 7; j++) {
        this.days[i][j] = {
          number: firstDay.date(),
          date: firstDay.format(this.format),
          object: firstDay.clone(),
          weekday: j,
          weekend: _.includes([5, 6], j),
          another: !firstDay.isSame(this.currentMonth, 'month')
        };
        firstDay.add(1, 'day')
      }
    }
  }

  protected checkDisabled(date): boolean {
    if (_.isFunction(this.disabledFn)) {
      return this.disabledFn(date);
    }
    return false;
  }
}
