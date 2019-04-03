import { Component, Input, ViewChild } from '@angular/core';
import { SuspendPeriodsService } from "../../services";
import { RangeCalendarComponent } from "../../../helpers/range-calendar/";
import { HeaderService } from "../header.service";
import { ToastService } from "../../../services/toast/toast.service";

@Component({
  selector: 'suspend-popover',
  providers: [SuspendPeriodsService],
  templateUrl: 'suspend-popover.html',
  styleUrls: ['suspend-popover.scss']
})

export class SuspendPopoverComponent {

  @ViewChild('calendar')
  public calendar: RangeCalendarComponent;

  public suspendedDays: string[] = [];
  public selectedRange: string[] = [];

  @Input() show = false;
  private loaded = false;

  public constructor(protected api: SuspendPeriodsService,
                     protected header: HeaderService,
                     protected toast: ToastService) {}

  ngOnChanges(changes) {
    if (changes['show'] && this.show && !this.loaded) this.load();
  }

  private load() {
    this.loaded = true;
    this.api.get(moment().startOf('month')).subscribe((data) => {
      this.suspendedDays = data;
    });
  }

  public onSelect(range: any): void {
    this.selectedRange = _([range]).flatten().invokeMap('toString').value();
  }

  public freeze(): void {
    this.api.create(_.first(this.selectedRange), _.last(this.selectedRange))
      .subscribe((data) => {
        this.suspendedDays = _.union(this.suspendedDays, data);
        this.header.suspendChanged(data);
        this.calendar.selectedStart = this.calendar.selectedEnd = null;
        this.selectedRange = []
      }, (error) => this.toast.error(error));
  }

  public open(): void {
    this.api.delete(_.first(this.selectedRange), _.last(this.selectedRange))
      .subscribe((data) => {
        _.pullAll(this.suspendedDays, data);
        this.suspendedDays = _.clone(this.suspendedDays);
        this.header.suspendChanged(data);
        this.calendar.selectedStart = this.calendar.selectedEnd = null;
        this.selectedRange = []
      }, (error) => this.toast.error(error));
  }
}
