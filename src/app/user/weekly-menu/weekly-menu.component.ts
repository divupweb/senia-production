import { Component, OnInit } from '@angular/core';
import { WeekInfoApiService } from "../services";
import { HeaderService } from "app/user/header";
import {AppStateService} from "app/services";

@Component({
  selector: 'weekly-menu',
  providers: [ WeekInfoApiService ],
  templateUrl: './weekly-menu.component.html',
  styleUrls: ['../shared/styles/user-main.scss', './weekly-menu.component.scss']
})
export class WeeklyMenuComponent implements OnInit {

  public weekData: any[] = [];

  public constructor(protected weekInfoApi: WeekInfoApiService,
                     protected header: HeaderService,
                     protected state: AppStateService
  ) {}

  protected currentWeekStart: string;

  public ngOnInit() {
    this.state.preferWeeklyMenu(true);
    this.header.suspendUpdate$.subscribe((dates) => {
      const start = moment(this.currentWeekStart);
      const currentWeek = _.times(7, () => start.add(1, 'day').format('DD-MM-YYYY'));
      if (_.some(currentWeek, (d) => _.includes(dates, d))) {
        this.loadData(this.currentWeekStart);
      }
    });
  }

  public onSelectWeek(weekStart: string): void {
    this.currentWeekStart = weekStart;
    this.loadData(weekStart);
  }

  protected loadData(weekStart: string): void {
    this.weekInfoApi.get(weekStart)
      .subscribe((data) => this.weekData = data)
  }

}
