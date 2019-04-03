import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { CompanyReportApiService } from './company-report-api.service'
import { ToastService, WindowRef } from "app/services";
import 'rxjs/add/operator/debounceTime';
import { Observable } from 'rxjs/Rx';
import { Mutex } from 'async-mutex';

@Component({
  selector: 'company-report',
  providers: [ CompanyReportApiService ],
  styleUrls: ['company-report.scss'],
  templateUrl: './company-report.html'
})

export class CompanyReportComponent {
  constructor(private service: CompanyReportApiService,
              private route: ActivatedRoute,
              private toastService: ToastService) {
                this.window = WindowRef.nativeWindow;
                this.init();
                Observable.fromEvent(this.window, 'resize').
                           debounceTime(500).
                           subscribe((event) => {
                             if (this.weekDays.length == 5 && this.isMobile() || this.weekDays.length < 5 && !this.isMobile()) {
                               this.init();
                             }
                           });
              }
  public window;
  public subscriptions: any[];
  public reportData: {};
  public forward: string;
  public back: string;
  public selectedSubscription: string;
  public weekStart: string;
  get weekStartMoment() {
    return moment(this.weekStart);
  }
  public weekDays: any[];
  public showPicker = false;
  protected dateFormat: string = 'YYYY-MM-DD';
  total: number[] = [];
  spinners: any[] = [];

  firstBlock = 30;
  scrolled = false;
  @HostListener('window:scroll', ['$event'])
  checkScroll(event): void {
    this.scrolled = document.body.scrollTop > this.firstBlock;
  }

  isMobile() {
    return this.window.innerWidth <= 768;
  }

  private init() {
    this.setWeekStart();
    this.route.params.subscribe((params) => {
      this.selectSubscription(params.subscription);
    });
  }

  selectSubscription(subscription: string) {
    this.selectedSubscription = subscription;
    this.getWeekData();
  }

  selectWeek(date) {
    this.weekStart = date;
    this.getWeekData();
  }

  selectCurrentWeek(): void {
    this.setWeekStart();
    this.getWeekData();
  }

  dateCalendarPicked(date): void {
    this.setWeekStart();
    this.getWeekData();
    this.showPicker = false;
  }

  formatDate(day: string): string {
    return this.parseDay(day).format('dddd');
  }

  weekDayFor(day) {
    return this.parseDay(day).format('dddd')[0]
  }

  employees() {
    return _.keys(this.reportData);
  }

  dayDishes(employee, day) {
    return _(this.reportData[employee]).get(`${day}.dishes`, []);
  }

  dishesPerDay(day: string): number {
    return _(this.reportData).map((employee) => _(employee).get(`${day}.dishes`))
        .flatten().map((dish) => _(dish).get('quantity', 0)).sum();
  }

  dayTotal(employee, day) {
    return _(this.reportData[employee]).get(`${day}.total`, 0);
  }
  employeeSubsidy(employee: string, day: string): number {
    return _(this.reportData[employee]).get(`${day}.subsidy`, 0);
  }

  subsidiesPerDay(day: string): number {
    return _(this.reportData).map((employee) => _(employee).get(`${day}.subsidy`, 0)).map(_.toNumber).sum();
  }

  private parseDay(day) {
    return moment(day, 'YYYY-MM-DD');
  }

  private getWeekData() {
    let period  = this.getDaysSelect();
    let observers = _.map(period, (day) => {
      this.spinners.push(this.dayFormat(day));
      return this.service.getWeekData(this.selectedSubscription, this.dayFormat(day), 1)
    })
    this.setDays(period);
    this.reportData = {};

    let mutex = new Mutex();
    let merge = async (mutex, response) => {
      let unlock = await mutex.acquire();
      this.mergeResult(response);
      this.buildTotal();
      unlock();
    }
    Observable.merge(...observers).subscribe(
      (response) => {
        merge(mutex, response)
        _.pull(this.spinners, response['week_days'][0])
      },
      (error) => this.toastService.error(error)
    )
  }

  showSpinner(date) {
    return _.includes(this.spinners, date);
  }

  private buildTotal(): void {
    let totalForDate = (date: string): number =>
      _(this.reportData).map((employee) => _(employee).get(`${date}.total`, 0)).map(_.toNumber).sum();
    this.total = this.weekDays.map(totalForDate);
  };

  private setWeekStart(date = undefined) {
    let result = moment(date);
    if (!this.isMobile()) result = result.startOf('isoWeek');
    this.weekStart = this.dayFormat(result);
  }

  private getDaysSelect() {
    let days = this.days()
    let result = [];
    for(let i = 0; i < days; i++) {
      let day = this.weekStartMoment.add(i, 'd');
      result.push(day)
    }
    return result;
  }

  private days() {
    return this.isMobile() ? 1 : 5;
  }

  private setDays(period) {
    let f = this.isMobile() ? 'd' : 'w';
    this.forward    = this.dayFormat(this.weekStartMoment.add(1, f));
    this.back       = this.dayFormat(this.weekStartMoment.add(-1, f));
    this.weekDays   = _.map(period, (day) => this.dayFormat(day));
  }

  private dayFormat(day) {
    return day.format(this.dateFormat);
  }

  private mergeResult(dayResult) {
    _.each(dayResult.report_data, (days, employee) => {
      this.addEmployeeToResult(employee, days);
    })
  }

  private addEmployeeToResult(employee, days) {
    if (!this.reportData.hasOwnProperty(employee)) {
      this.reportData[employee] = days;
    } else {
      this.mergeEmployee(this.reportData[employee], days);
    };
  }

  private mergeEmployee(employeeData, days) {
    _.each(days, (values, day) => {
      if (!employeeData.hasOwnProperty(day)) {
        employeeData[day] = values;
      } else {
        let dayData = employeeData[day]
        dayData.subsidy = +dayData.subsidy + values.subsidy;
        dayData.total = +dayData.total + values.total;
        _.each(values.dishes, (dish) => {
          let oldDish = _.find(dayData.dishes, { dish: dish.dish, kitchen: dish.kitchen })
          if (!oldDish) {
            dayData.dishes.push(dish)
          } else {
            oldDish.quantity = +oldDish.quantity + dish.quantity
          }
        })
      }
    })
  }
}
