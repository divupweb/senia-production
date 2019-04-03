import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {ManualOrdersComponent, ReportPopupComponent} from "app/admin/dashboard/dashboard";
import {ManualOrdersApiService} from "app/admin/dashboard/dashboard/manual-order/manual-orders-api.service";
import {ToastService, WindowRef} from "app/services";
import { DashboardApiService } from "app/admin/dashboard/dashboard/dashboard-api.service"

@Component({
  providers: [ManualOrdersApiService],
  selector: 'day-item-component',
  styleUrls: ['./day-item.scss', '../manual-order/manual-order.scss'],
  templateUrl: './day-item.html'
})
export class DayItemComponent implements OnInit {
  @Input()
  public data: any;

  @ViewChild('report')
  public report: ReportPopupComponent;

  @ViewChild('form')
  public form: ManualOrdersComponent;

  public orders: any[] = [];

  @Input()
  public subscription: string;
  public window;

  public constructor(protected service: ManualOrdersApiService,
                     protected toast: ToastService,
                     protected dashboardService: DashboardApiService) {
     this.window = WindowRef.nativeWindow;
  }

  public calcDishes(item: any): number {
    return _.reduce(item.order_dishes, (sum, orderDish) => sum + _.get(orderDish, 'quantity', 0), 0)
  }

  public ngOnInit(): void {
    this.service.getOrders(this.subscription, this.data[this.subscription].date)
      .subscribe((orders) => this.orders = orders);
  }

  public removeOrder(item: any): void {
    this.service.remove(item.id).subscribe(() => _.remove(this.orders, item), (error) => this.toast.error(error));
  }

public printPackaging() {
  let url = this.dashboardService.packgingUrl(this.subscription, this.data[this.subscription].date)
  this.window.open(url, '_blank').focus();
}

}
