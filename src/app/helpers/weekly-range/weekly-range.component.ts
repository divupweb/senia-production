import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: 'weekly-range',
  styleUrls: ['weekly-range.scss'],
  templateUrl: 'weekly-range.html',
})
export class WeeklyRangeComponent {
  public forward: string;
  public back: string;
  public weekStart: string;
  public showPicker: boolean = false;

  @Output()
  public onSelectWeek: EventEmitter<string> = new EventEmitter();

  protected dateFormat: string = 'YYYY-MM-DD';

  public ngOnInit(): void {
    this.setUpCurrentWeek();
  }

  public selectWeek(weekStart): void {
    this.weekStart = weekStart;
    this.initWeeklyControl(weekStart);
    this.onSelectWeek.emit(this.weekStart);
  }

  public dateCalendarPicked(date): void {
    this.selectWeek(this.startOfWeek(moment(date)));
    this.showPicker = false;
  }


  public setUpCurrentWeek(): void {
    this.selectWeek(this.startOfWeek(moment()))
  }

  protected startOfWeek(date): string {
    return date.startOf('isoWeek').format(this.dateFormat);
  }

  protected initWeeklyControl(weekStart): void {
    const currentWeek = moment(weekStart, this.dateFormat);
    this.forward = this.startOfWeek(currentWeek.clone().add(1, 'week'));
    this.back = this.startOfWeek(currentWeek.clone().subtract(1, 'week'));
  }

}
