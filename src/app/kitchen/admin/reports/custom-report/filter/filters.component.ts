import { Component, Output } from '@angular/core';
import { EventEmitter } from "@angular/core";
import { KitchenSubscriptionProxy, KitchenDishCategoriesProxy } from "app/kitchen/shared";
import {TranslateService} from "@ngx-translate/core";



@Component({
  selector: 'report-filters',
  styles: [require('./filters.scss')],
  template: require('./filters.html')
})

export class FiltersComponent {

  @Output()
  public onChange = new EventEmitter();

  @Output()
  public onSubmit = new EventEmitter();

  @Output()
  public onDownload = new EventEmitter();

  public dateValue: any[];
  public categoryValue: number[] = [];
  public mealValue: string[] = [];
  public groupingValue: number = 0;

  protected dateOptions: boolean = false;
  protected categoriesOptions: boolean = false;
  protected mealOptions: boolean = false;
  protected groupingOptions: boolean = false;
  protected categories: any[] = [];
  protected subscriptions: any[] = [];
  protected defaultSelected: any[];
  protected format = 'DD-MM-YYYY';

  protected groupings: string[][] = [
    ['category', 'date', 'service'],
    ['date', 'category', 'service'],
  ];

  public search = '';
  public searchColumns = ['name'];

  public constructor(private subscriptionProxy: KitchenSubscriptionProxy,
                     private categoriesProxy: KitchenDishCategoriesProxy,
                     protected translate: TranslateService
  ) {
    this.dateValue = [moment().startOf('day').subtract(7, 'days'), moment().startOf('day')];
  }

  public ngOnInit(): void {
    this.defaultSelected = _.clone(this.dateValue);
    this.categoriesProxy.getAll()
      .subscribe((data) => {
        this.categories = data;
        this.selectAllCategories();
      });
    this.subscriptionProxy.getAll()
      .subscribe((data: any[])=> {
        this.subscriptions = data;
        this.mealValue = _.map(this.subscriptions, 'subscription_type');
      })
  }

  public closeOptions(type: string): void {
    this[type] = false;
  }

  public toggleState(type: string): void {
    this[type] = !this[type];
  }

  public mealChange($event): void {
    if ($event.target.checked) {
      this.mealValue.push($event.target.value);
    } else {
      this.mealValue.splice(this.mealValue.indexOf($event.target.value), 1);
    }
  }

  public pickerChange($event: any[]): void {
    this.dateValue = $event
  }

  public groupingChange($event): void {
    if ($event.target.checked) {
      this.groupingValue = $event.target.value;
    }
  }

  public categoryChange($event): void {
    if ($event.target.checked) {
      this.categoryValue.push(_.toInteger($event.target.value));
    } else {
      this.categoryValue.splice(this.categoryValue.indexOf(_.toInteger($event.target.value)), 1);
    }
  }

  public selectAllCategories(): void {
    this.categoryValue = _.map(this.categories, (m) => m.id);
  }

  public deselectAllCategories(): void {
    this.categoryValue = [];
  }

  public selectedCategories(): any[] {
    return _.chain(this.categories).filter((m) => _.includes(this.categoryValue, m.id)).map('name').value();
  }

  public selectedGrouping(): string[] {
    return _(this.groupings[this.groupingValue])
      .map((k: string) => this.translate.instant(`SHARED.FILTERS.GROUPINGS.${k.toUpperCase()}`)).value();
  }

  public selectedService(): string[] {
    return _(this.mealValue).map((s: string) => this.translate.instant(`SUBSCRIPTIONS.${s.toUpperCase()}`)).value()
  }


  public toParams(): any {
    return {
      date: {
        start: _.first(this.dateValue).format(this.format),
        end: _.last(this.dateValue).format(this.format),
      },
      categories: this.categoryValue,
      subscriptions: this.mealValue,
      grouping: this.groupings[this.groupingValue],
    };
  }
}
