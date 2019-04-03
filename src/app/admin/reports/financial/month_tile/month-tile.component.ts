
import {Component, Input, OnInit} from "@angular/core";
import {ReportApiService} from "../report-api.service";

@Component({
  providers: [ReportApiService],
  selector: 'month-tile',
  styleUrls: ['month-tile.scss'],
  templateUrl: 'month-tile.html'
})
export class MonthTileComponent implements OnInit {

  @Input()
  public month: any;

  public data: any = {};

  public charged: number = 0;
  public paid: number = 0;
  public profit: number = 0;

  protected format: string = 'YYYY-MM-DD';
  isFinite = isFinite; // bind js function
  public constructor(protected service: ReportApiService) {}

  public ngOnInit(): void {
    this.loadData()
  }

  protected loadData(): void {
    this.service.getGeneral({ date: {
      start: this.month.clone().startOf('month').format(this.format),
      end: this.month.clone().endOf('month').format(this.format) }
    }).subscribe((data) => {
      this.data = data;
      this.profit = data.charged == 100 ? 0 : (data.profit / data.charged) * 100;
      this.paid = data.charged == 0 ? 100 : (data.paid / data.charged) * 100;
      this.charged = 100;
    })
  }
}
