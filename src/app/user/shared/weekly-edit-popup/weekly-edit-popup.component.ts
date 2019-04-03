import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuFeedApiService, CustomOrdersApiService } from "../../services";
import { ToastService } from "../../../services/";

@Component({
  selector: 'weekly-edit-popup',
  providers: [MenuFeedApiService, CustomOrdersApiService],
  styleUrls: ['weekly-edit-popup.scss'],
  templateUrl: 'weekly-edit-popup.html'
})

export class WeeklyEditPopupComponent {

  public menuItems: any = {};

  public itemsValue: any;
  set items(value) {
    this.itemsValue = value;
    this.sortCurrent();
  }

  get items(): any {
    return this.itemsValue;
  }

  @Input()
  public subscriptions: string[];

  @Input()
  public date: string;

  @Output()
  public onConfirmChanges: EventEmitter<any> = new EventEmitter();

  public state: boolean = false;
  public selected: number = 0;

  public isDirty: boolean = false;

  public sortItems: any[] = [
    {
      id: 'kitchen',
      name: 'SORT.BY_KITCHEN',
      params: [['kitchenName'], ['asc']]
    },
    {
      id: 'name',
      name: 'SORT.BY_NAME',
      params: [['name'], ['asc']]
    },
    {
      id: 'priceAsc',
      name: 'SORT.BY_PRICE_ASC',
      params: [[(e) => +e.price], ['asc']]
    },
    {
      id: 'priceDesc',
      name: 'SORT.BY_PRICE_DESC',
      params: [[(e) => +e.price], ['desc']]
    },
  ];

  public activeSort = this.sortItems[0];
  public showDropdown = false;

  public constructor(protected menuFeed: MenuFeedApiService,
                     protected orderApi: CustomOrdersApiService,
                     protected toast: ToastService) {}

  public onSortSelect(item): void {
    this.activeSort = item;
    this.showDropdown = false;
    this.sortCurrent();
  }

  public openDropdown(): void {
    setTimeout(() => this.showDropdown = true, 100);
  }

  public closeDropdown(): void {
    this.showDropdown = false;
  }

  public ngOnInit(): void {
    if (this.subscriptions && this.date) this.init();
  }

  public show(): void {
    this.isDirty = false;
    this.items = _.cloneDeep(this.menuItems);
    this.state = true;
  }

  public close(): void {
    this.state = false;
  }

  public confirm(): void {
    _(this.items).each((orders: any[], subscription: string) => {
      this.orderApi.bunchCreateOrUpdate(this.date, subscription, _.map(orders, (o) => {
        return {
          amount: o.quantity,
          kitchen_dish_category_id: o.category.kitchen_dish_category.id,
        }
      })).subscribe((data) => {
        this.menuItems[subscription] = orders;
        this.onConfirmChanges.emit({ subscription, orders: data });
      }, (error) => this.toast.error(error));
      this.close();
    })
  }


  protected init(): void {
    _(this.subscriptions).each((s) => {
      this.menuFeed.get(this.date, s)
        .subscribe((data) => {
          this.buildMenuItems(s, data.kitchens);
          this.items = _.cloneDeep(this.menuItems);
      })
    });
  }

  protected sortCurrent() {
    _(this.itemsValue).each((items, s) => {
      this.itemsValue[s] = _.orderBy(items, ...this.activeSort.params)
    })
  }

  public buildMenuItems(s, kitchens): void {
    this.menuItems[s] = [];
    _.each(kitchens, (kitchen) => {
      _.each(kitchen.categories, (category) => {
        let dishCategory = category.kitchen_dish_category;
        let dish = category.dish;
        let itemPrice = dish ? dish.price : [dishCategory.min_price, dishCategory.max_price];
        let maxPrice = _([itemPrice]).flatten().max();
        const name = dish && dish.name ? dish.name : dishCategory.dish_category;
        this.menuItems[s].push({
          id: category.id,
          name,
          price: maxPrice,
          quantity: category.quantity,
          deadline: kitchen.deadline_due_time,
          kitchen: kitchen.kitchen,
          kitchenName: kitchen.kitchen.name,
          displayUrl: category.information.display_url,
          category,
          itemPrice
        });
      })
    });
  }
}
