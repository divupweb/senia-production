import {Component, HostListener} from '@angular/core';
import { AdminOrdersApiService } from '../admin-orders-api.service';
import { ToastService } from "app/services";

@Component({
  selector: 'company-orders',
  providers: [AdminOrdersApiService],
  styleUrls: ['company-orders.scss'],
  templateUrl: './company-orders.html'
})

export class CompanyOrdersComponent {
  selectedWeek = moment().startOf('isoWeek');
  selectedSubscription = 'lunch';
  subscriptions = ['breakfast', 'lunch', 'dinner'];
  data = [];
  dates = [];
  public total = [];

  public weeklyTotal: { companies: number,  dishes: number } = { companies: 0, dishes: 0 };

  constructor(protected api: AdminOrdersApiService, protected toast: ToastService) { }

  protected firstBlock = 30;
  protected scrolled = false;

  @HostListener('window:scroll', ['$event'])
  public checkScroll(): void {
    this.scrolled = document.body.scrollTop > this.firstBlock;
  }


  public deliveredAll(date: any): boolean {
    const statuses = _.chain(this.data)
      .map('dates').flatten()
      .filter({ date: this.dateFormat(date) })
      .map('kitchens').flatten()
      .map((k) => _.get(k, 'shipment.status') == 'delivered')
      .value();
    return statuses.length > 0 && !_.includes(statuses, false);
  }

  selectSubscription(subscription) {
    this.selectedSubscription = subscription;
    this.updateData();
  }

  selectWeek(value) {
    this.selectedWeek = moment(value).startOf('isoWeek');
    this.updateData();
  }

  private updateData() {
    this.data = [];
    this.api.get(this.dbDate(), this.selectedSubscription, 'company_orders').subscribe(
      (response) => {
        this.buildDates();
        this.data = response;
        this.buildTotal()
      }, (error) => this.toast.error(error)
    )
  }

  private dbDate(): string {
    return this.dateFormat(this.selectedWeek);
  }

  private dateFormat(date) {
    return moment(date).format('YYYY-MM-DD');
  }

  private buildDates() {
    this.dates = Array(5).fill( 0 ).map((_, i) => moment(this.selectedWeek).add(i, 'd'))
  }

  private buildTotal() {
    const totalForDate = (date) => {
      let sum = 0;
      this.data.forEach((company) => {
        company.dates.forEach((companyDate) => { if (companyDate.date == date) sum += companyDate.total })
      });
      return sum;
    };

    this.total = this.dates.map((date) => {
      const dateKey = this.dateFormat(date);
      return {
        count: totalForDate(dateKey),
        delivered: this.deliveredAll(dateKey)
      };
    });
    this.weeklyTotal.companies = _.size(this.data);
    this.weeklyTotal.dishes = _.reduce(this.total, (sum, e) => sum + e.count, 0)
  }
}
