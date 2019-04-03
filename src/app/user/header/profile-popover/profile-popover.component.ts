import {Component, OnInit} from '@angular/core';
import { ReportApiService } from "./report-api.service";
import { AuthService, AppStateService } from "app/services";
import { Router } from '@angular/router'

@Component({
  selector: 'profile-popover',
  providers: [ReportApiService],
  templateUrl: 'profile-popover.html',
  styleUrls: ['profile-popover.scss']
})
export class ProfilePopoverComponent implements OnInit {
  public type = 'Pie';
  public data: any = {series: []};
  public options: any = {
    donut: true,
    donutWidth: 23,
    fullWidth: true,
    donutSolid: true,
    startAngle: 270,
    showLabel: true,
    chartPadding: 15,
    labelOffset: 20,
    labelDirection: 'explode',
  };

  public total: number = 0;
  public current: any = {};
  public user: any = {};
  public company: any = {};

  public constructor(
    public auth: AuthService,
    public state: AppStateService,
    protected api: ReportApiService,
    private router: Router
  ) {
    this.user = state.currentUser();
    this.company = state.currentCompany();
  }

  public ngOnInit(): void {
    this.current = moment();
    this.load();
  }

  public changeMonth(offset: number): void {
    this.current = _.clone(this.current.add(offset, 'month'));
    this.load();
  }

  protected load(): void {
    this.api.get(this.current).subscribe((data) => {
      this.total = data.total;
      this.data = {
        series: [],
        labels:[],
      };
      _(data.dishes).each((dish: { dish_category: string, amount: string, percentage: number }) => {
        const series = { value: dish.percentage, name: dish.dish_category, meta: dish.amount };
        this.data.series.push(series);
        this.data.labels.push(dish.dish_category);
      })
    });
  }

  navigateAdmin() {
    this.router.navigate(['company', 'dashboard']);
  }

}
