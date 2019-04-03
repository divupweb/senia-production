import { Component, HostListener } from '@angular/core';
import { KitchenReportApiService } from '../shared'
import { ToastService, WindowRef, WindowWidth } from "app/services";
import { ActivatedRoute } from "@angular/router";
import 'rxjs/add/operator/debounceTime';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'company-report',
  styleUrls: ['./kitchen-report.scss'],
  templateUrl: './kitchen-report.html',
  providers: [WindowWidth]
})

export class KitchenReportComponent {
  constructor(private service: KitchenReportApiService,
              private route: ActivatedRoute,
              private toastService: ToastService,
              public width: WindowWidth) {
                this.init();
                Observable.fromEvent(WindowRef.nativeWindow, 'resize').
                debounceTime(1500).
                subscribe((event) => {
                  if (this.weekDays.length == 5 && this.width.isMobile() || this.weekDays.length < 5 && !this.width.isMobile()) {
                    this.init();
                  }
                });
              }

  public reportData: {};
  public summaryData: {} = {};
  public summaryKeys: string[] = ['produced', 'predicted'];
  public isLoading: boolean = false;
  public forward: string;
  public back: string;
  public selectedSubscription: string;
  public weekStart: string;
  public weekDays: string[];
  public showPicker: boolean = false;
  public showCustomPicker: boolean = false;
  public isWeeklyView: boolean = true;
  public customPeriod: any[];
  public selectedPeriod: any[];

  protected dateFormat: string = 'YYYY-MM-DD';

  protected firstBlock = 30;
  protected scrolled = false;

  @HostListener('window:scroll', ['$event'])
  public checkScroll(): void {
    this.scrolled = document.body.scrollTop > this.firstBlock;
  }

  private init(): void {
    this.weekStart = this.startOfWeek(moment());
    this.initWeeklyControl(this.weekStart);
    this.route.params.subscribe((params: any) => {
      this.selectSubscription(params.subscription);
    });
  }

  public selectSubscription(subscription: string): void {
    this.selectedSubscription = subscription;
    this.getWeekData();
  }

  public selectWeek(weekStart): void {
    this.weekStart = weekStart;
    this.initWeeklyControl(weekStart);
    this.getWeekData();
  }

  public selectCurrentWeek(): void {
    this.setUpCurrentWeek();
    this.getWeekData();
  }

  public setUpCurrentWeek(): void {
    this.weekStart = this.startOfWeek(moment());
    this.initWeeklyControl(this.weekStart);
  }

  public dateCalendarPicked(date): void {
    this.selectWeek(this.startOfWeek(moment(date)));
    this.showPicker = false;
  }

  public backToWeeklyView(): void {
    this.isWeeklyView = true;
    this.getWeekData();
  }

  public setPeriod(): void {
    this.isWeeklyView = false;
    this.showCustomPicker = false;
    this.summaryData = {};
    this.isLoading = true;
    this.selectedPeriod = this.customPeriod;
    this.service.getSummaryData(this.selectedSubscription,
      this.customPeriod[0].format(this.dateFormat), this.customPeriod[1].format(this.dateFormat))
      .finally(() => this.isLoading = false)
      .subscribe((data) => {
        this.summaryData = data;
      }, (error) => this.toastService.error(error))
  }

  public setCustomPeriod($event): void {
    this.customPeriod = $event
  }

  public isAllLocked(dishes: any[]): boolean {
    return !(_.isEmpty(dishes) || _.some(dishes, { locked: false }));
  }

  private getWeekData(): void {
    let daysCount = this.width.isMobile() ? 1 : 5;
    this.service.getWeekData(this.selectedSubscription, this.weekStart, daysCount).subscribe(
      (response) => {
        this.reportData = response;
        this.weekDays = _(response).keys().sort().value();
      },
      (error) => this.toastService.error(error)
    )
  }

  private initWeeklyControl(weekStart): void {
    const currentWeek = moment(weekStart, this.dateFormat);
    let timeItem = this.width.isMobile() ? 'day' : 'week'
    this.forward = this.startOfWeek(currentWeek.clone().add(1, timeItem));
    this.back = this.startOfWeek(currentWeek.clone().subtract(1, timeItem));
  }

  private startOfWeek(date = null) {
    let result = moment(date);
    if (!this.width.isMobile()) result = result.startOf('isoWeek')
    return result.format(this.dateFormat);
  }
}
