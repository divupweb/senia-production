import { Component, Output } from '@angular/core';
import { EventEmitter } from "@angular/core";
import {
  EmployeesProxyService,
  SubscriptionsProxyService
} from 'app/company/employees/shared/proxies';
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'report-filters',
  styleUrls: ['filters.scss'],
  templateUrl: './filters.html'
})

export class FiltersComponent {

  @Output()
  public onChange = new EventEmitter();

  @Output()
  public onSubmit = new EventEmitter();

  @Output()
  public onDownload = new EventEmitter();

  public dateValue: any[];
  public employeeValue: number[] = [];
  public mealValue: string[] = [];
  public groupingValue: number = 0;
  public includeCompanyValue: boolean = false;

  protected dateOptions: boolean = false;
  protected employeeOptions: boolean = false;
  protected mealOptions: boolean = false;
  protected groupingOptions: boolean = false;
  protected employees: any[] = [];
  protected subscriptions: any[] = [];
  protected defaultSelected: any[];

  protected meal: string[] = ['breakfast', 'lunch', 'dinner'];
  protected format = 'DD-MM-YYYY';

  protected groupings: string[][] = [
    ['employee', 'date', 'meal'],
    ['date', 'employee', 'meal'],
    ['employee', 'meal', 'date'],
  ];

  public search = '';
  public searchColumns = ['name', 'email'];

  public constructor(private employeeProxy: EmployeesProxyService,
                     private subscriptionProxy: SubscriptionsProxyService,
                     protected translate: TranslateService
  ) {
    this.dateValue = [moment().startOf('day').subtract(7, 'days'), moment().startOf('day')];
  }

  public ngOnInit(): void {
    this.defaultSelected = _.clone(this.dateValue);
    this.employeeProxy.getAll()
      .subscribe((employees) => {
        this.employees = employees;
      });
    this.subscriptionProxy.getAll()
      .subscribe((data) => {
        this.subscriptions = _.chain(data).values().filter((e) => e['subscription_type'] != 'catering').value();
        this.mealValue = _.map(this.subscriptions, (e) => e.subscription_type);
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

  public employeeChange($event): void {
    if ($event.target.checked) {
      this.employeeValue.push(_.toInteger($event.target.value));
    } else {
      this.employeeValue.splice(this.employeeValue.indexOf(_.toInteger($event.target.value)), 1);
    }
  }

  public selectAllEmployees(): void {
    this.employeeValue = _.map(this.employees, m => m.id);
    this.includeCompanyValue = true;
  }

  public deselectAllEmployees(): void {
    this.employeeValue = [];
    this.includeCompanyValue = false;
  }

  public selectedEmployees(): any[] {
    return _.chain(this.employees).filter(m => _.includes(this.employeeValue, m.id)).map('name').value();
  }

  public currentGrouping(): string[] {
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
      employees: this.employeeValue,
      include_company: this.includeCompanyValue,
      subscriptions: this.mealValue,
      grouping: this.groupings[this.groupingValue],
    };
  }
}
