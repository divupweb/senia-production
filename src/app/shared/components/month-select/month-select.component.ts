import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'month-select',
  templateUrl: './month-select.html',
  styleUrls: ['./month-select.scss']
})

export class MonthSelectComponent {
  _period: any;
  showDropdown = false;
  months = [];

  @Input() active = true;
  @Input()
  set period(period) {
    var _period;
    if(period) {
      _period = moment(period);
    } else {
      _period = moment();
    }

    this._period = _period.startOf('month');
  }

  get period() {
    return this._period;
  }

  ngOnInit() {
    var start = moment().startOf('year');
    for (let i = 0; i < 12; i++) {
      this.months.push(start.clone().add(i, 'months'));
    }
  }

  @Output() change = new EventEmitter();


  nextPeriod() {
    this.changePeriod(1);
  }

  previousPeriod() {
    this.changePeriod(-1);
  }

  selectMonth(month) {
    this.period = month;
    this.onDateChange();
  }

  openDropdown() {
    this.showDropdown = true;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  onDateChange() {
    this.showDropdown = false;
    this.change.emit(this.period);
  }

  private changePeriod(months = 1): any {
    this.period = this.period.add(months, 'months');
    this.onDateChange();
  }
}
