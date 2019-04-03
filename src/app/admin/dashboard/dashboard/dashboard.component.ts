import {Component} from '@angular/core';
import { ToastService } from "app/services";
import {DashboardApiService} from "./dashboard-api.service";


@Component({
  providers: [ DashboardApiService],
  selector: 'dashboard',
  styleUrls: [ 'dashboard.scss' ],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {

  public dailyData: any;

  constructor(protected api: DashboardApiService, protected toast: ToastService) {}

  onDaySelect(value: any[]) {
    this.loadData([_.first(value), _.last(value)]);
  }

  protected loadData(dates: any[]) {
   this.api.get(dates).subscribe((data) => this.dailyData = _.values(data), (error) => this.toast.error(error))
  }

}
