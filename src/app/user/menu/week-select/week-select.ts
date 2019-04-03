import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { WeekInfoApiService } from "app/user/services";
import { ToastService } from "app/services";
import { LineCalendarWeeklyComponent } from "app/shared/components/line-calendar/line-calendar-weekly.component";
import { HeaderService } from "app/user/header";

const CUSTOM = 2;
const PERIODIC = 1;

@Component({
  selector: 'week-select',
  providers: [WeekInfoApiService],
  styleUrls: ['week-select.scss'],
  templateUrl: './week-select.html'
})

export class WeekSelectComponent implements OnInit {
  @Input() selectedDay: any = {};

  @Output() onDaySelect = new EventEmitter();

  @Output()
  public onWeeklyUpdate = new EventEmitter();

  @ViewChild('calendar')
  public calendar: LineCalendarWeeklyComponent;

  selectedDayObjectIndex: number = 0;

  public calendarFormat = 'DD-MM-YYYY';

  public days: any = {};

  constructor(protected _weekInfoApi: WeekInfoApiService,
              protected toastService: ToastService,
              protected header: HeaderService) {}

  public ngOnInit(): void {
    this.header.suspendUpdate$.subscribe((dates) => {
      if (_.some(this.calendar.daysShown, (d) => _.includes(dates, moment(d.iso_date).format(this.calendarFormat)))) {
        this.calculateSelected();
      }
    })
  }

  public ngOnChanges() {
    this.selectedDayObjectIndex = moment(this.selectedDay).isoWeekday() - 1;
  }

  public selectDay(date) {
    this.selectedDay = date;
    this.calendar.selectDay(date);
    this.calculateSelected();
  }

  public onSelectDay(date): void {
    const selectedDate = date.clone();
    this.selectedDayObjectIndex = selectedDate.isoWeekday() - 1;
    this.onDaySelect.emit(selectedDate.toDate());
  }

  public onWeekChange(): void {
    const dates = _.map(this.calendar.daysShown, 'iso_date');
    if (!moment(this.selectedDay).isSame(moment(_.first(dates)), 'week')) {
      const dayObject = this.calendar.daysShown[this.selectedDayObjectIndex];
      this.calendar.selectedDays = [dayObject];
      const daySelected = moment(dayObject.iso_date);
      this.calculateDays(daySelected);
      this.onDaySelect.emit(daySelected.toDate());
    }
  }

  public updateDayInfo(date: string, type: string, info: { amount: number, periodic: boolean, custom: boolean }): void {
    const day = this.days[date];
    const circle = _.find(day.orders, { type });
    const kind = info.custom ? CUSTOM : PERIODIC;
    if (circle) {
      if (info.amount == 0) {
        _.remove(day.orders, circle);
      } else {
        _.merge(circle, { kind });
      }
    } else {
      day.orders.push({ type, kind });
    }
  }

  protected calculateDays(selectedDay: any|any): void {
    this._weekInfoApi.get(selectedDay.format('YYYY-MM-DD')).subscribe(
      (weekDays) => {
        this.days = {};
        this.onWeeklyUpdate.next(weekDays);
        _.each(weekDays, (day) => {
          if (!this.days[day.date]) {
            this.days[day.date] = {
              disabled: false,
              orders: [],
            };
          }
          _(day.orders).each((orders, subscr) => {
            this.days[day.date].orders.push({
              type: subscr,
              kind: _(orders).some({ information: { type: 'CustomOrder' } }) ? CUSTOM : PERIODIC,
            })
          });
        });
      }, (error) => this.toastService.error(error)
    );
  }

  protected calculateSelected(): void {
    this.calculateDays(moment(this.selectedDay));
  }
}
