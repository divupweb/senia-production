import { Component, HostListener } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AdminOrdersApiService } from '../admin-orders-api.service';
import { ToastService } from "app/services";
import { Mutex } from 'async-mutex';


@Component({
  selector: 'kitchen-orders',
  providers: [AdminOrdersApiService],
  styleUrls: ['kitchen-orders.scss'],
  templateUrl: './kitchen-orders.html'
})

export class KitchenOrdersComponent {
  selectedWeek;
  pickedDate;
  selectedSubscription = 'lunch';
  subscriptions = ['breakfast', 'lunch', 'dinner'];
  data;
  showPicker = false;

  constructor(public api: AdminOrdersApiService,
              public toast: ToastService) { }

  firstBlock = 30;
  scrolled = false;
  @HostListener('window:scroll', ['$event'])
  checkScroll(event): void {
    this.scrolled = document.body.scrollTop > this.firstBlock;
  }
  ngOnInit() {
    this.backToday()
  }

  selectSubscription(subscription) {
    this.selectedSubscription = subscription;
    this.loadData();
  }

  selectWeek(value) {
    this.selectedWeek = moment(this.selectedWeek).add(value, 'w');
    this.loadData();
  }

  dateFormat(date) {
    return moment(date).format('YYYY-MM-DD');
  }

  backToday() {
    this.selectedWeek = moment().startOf('isoWeek');
    this.loadData();
  }

  private loadData() {
    this.initData();
    let beginning = moment(this.selectedWeek);

    let observers = [];
    for(let i = 0; i <= 4; i++) {
      let day = beginning.clone().add(i, 'd');
      let dayString = this.dateFormat(day);
      let observer = this.api.get(dayString, this.selectedSubscription, 'kitchen_orders');
      observers.push(observer);
    }
    let mutex = new Mutex();

    let merge = async (mutex, response) => {
      let unlock = await mutex.acquire();
      this.mergeResult(response);
      this.sortResult();
      unlock();
    }

    Observable.merge(...observers).subscribe(
      (response) => merge(mutex, response),
      (error) => this.toast.error(error)
    )
  }

  private dbDate(): string {
    return this.dateFormat(this.selectedWeek);
  }

  private initData() {
    this.data = {
      dates: [],
      day_deliveries: [],
      kitchens: [],
      total_deliveries: {
        errors: 0,
        items: 0,
        shipments: 0
      }
    };
  }

  private mergeResult(dayResult) {
    this.data.dates = this.data.dates.concat(dayResult.dates);
    this.data.day_deliveries = this.data.day_deliveries.concat(dayResult.day_deliveries);
    _.each(dayResult.total_deliveries, (v, k) => {
      this.data.total_deliveries[k] += v;
    });
    _.each(dayResult.kitchens, (kitchen) => {
      let dataKitchen = _.find(this.data.kitchens, { id: kitchen.id });
      if (dataKitchen) {
        dataKitchen.days = dataKitchen.days.concat(kitchen.days);
      } else {
        this.data.kitchens.push(kitchen)
      }
    });
  }

  private sortResult() {
    let sortedDates = _.orderBy(this.data.dates, (date) => moment(date));
    _.each(sortedDates, (date, i) => {
      let j = this.data.dates.indexOf(date)
      if (j > -1 && j != i) this.switchDay(j, i);
    })
  }

  private switchDay(i, j) {
    let data = this.data;
    [data.dates[i], data.dates[j]] = [data.dates[j], data.dates[i]];
    [data.day_deliveries[i], data.day_deliveries[j]] = [data.day_deliveries[j], data.day_deliveries[i]];
    _.each(data.kitchens, (kitchen) => {
      [kitchen.days[i], kitchen.days[j]] = [kitchen.days[j], kitchen.days[i]]
    })
    data.kitchens = _.orderBy(data.kitchens, 'name')
  }
}
