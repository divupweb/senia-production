import { Component, Output } from '@angular/core';
import { EventEmitter } from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {AdminCompaniesService, AdminKitchensService} from "app/admin/services";
import {Observable} from "rxjs";


@Component({
  providers: [AdminCompaniesService, AdminKitchensService],
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

  @Output()
  public onClickBack: EventEmitter<any> = new EventEmitter();

  public companies: any[] = [];
  public employees: any[] = [];
  public kitchens: any[] = [];

  public companyInvoices: boolean = true;
  public cardCharges: boolean = true;
  public kitchenInvoices: boolean = true;
  public delivery: boolean = true;

  public companiesList: (query) => Observable<any> = (query: string) =>
    this.companyService.getList({page: 1, per_page: 5, query })
      .map((data: any) => _.get(data,'items', []));

  public employeesList: (query) => Observable<any> = (query: string) => this.companyService.getEmployees(query);

  public kitchensList: (query) => Observable<any> = (query: string) =>
    this.kitchenService.getList({page: 1, per_page: 5, query })
    .map((data: any) => _.get(data,'items', []));

  public subscriptions: any[] = ['breakfast', 'lunch', 'dinner'];

  public dateOptions: boolean = false;
  public employeeOptions: boolean = false;
  public companyOptions: boolean = false;
  public kitchenOptions: boolean = false;
  public subscriptionOptions: boolean = false;

  public dateValue: any|Date[];
  public employeeValue: number[] = [];
  public subscriptionValue: string[] = _.clone(this.subscriptions);

  public defaultSelected: any|Date[];
  protected format = 'DD-MM-YYYY';

  public search = '';
  public searchColumns = ['name', 'email'];

  public constructor(protected translate: TranslateService,
                     protected companyService: AdminCompaniesService,
                     protected kitchenService: AdminKitchensService
  ) {
    this.dateValue = [moment().startOf('day').subtract(7, 'days'), moment().startOf('day')];
  }

  public addCompany(company: any): void {
    if (!_.find(this.companies,  company)) {
      this.companies.push(company);
    }
  }

  public addEmployee(employee: any): void {
    if (!_.find(this.employees,  employee)) {
      this.employees.push(employee);
    }
  }

  public addKitchen(kitchen: any): void {
    if (!_.find(this.kitchens,  kitchen)) {
      this.kitchens.push(kitchen);
    }
  }

  public download(): void {
    this.onDownload.emit(this.toParams());
  }

  public submit(): void {
    this.onSubmit.emit(this.toParams());
  }

  public ngOnInit(): void {
    this.defaultSelected = _.clone(this.dateValue);
  }

  public setDate(range): void {
    this.dateValue = range;
    this.defaultSelected = _.cloneDeep(this.defaultSelected);
  }

  public closeOptions(type: string): void {
    this[type] = false;
  }

  public toggleState(type: string): void {
    this[type] = !this[type];
  }

  public selectedCompanies(): string[] {
    return _.map(this.companies, 'name');
  }

  public selectedKitchens(): string[] {
    return _.map(this.kitchens, 'name');
  }

  public subscriptionChange($event): void {
    if ($event.target.checked) {
      this.subscriptionValue.push($event.target.value);
    } else {
      this.subscriptionValue.splice(this.subscriptionValue.indexOf($event.target.value), 1);
    }
  }

  public pickerChange($event: any[]): void {
    this.dateValue = $event
  }

  public employeeChange($event): void {
    if ($event.target.checked) {
      this.employeeValue.push(_.toInteger($event.target.value));
    } else {
      this.employeeValue.splice(this.employeeValue.indexOf(_.toInteger($event.target.value)), 1);
    }
  }

  public removeCompany(item: any): void {
    setTimeout(() =>_.remove(this.companies, item), 50);
  }

  public removeEmployee(item: any): void {
    setTimeout(() =>_.remove(this.employees, item), 50);
  }

  public removeKitchen(item: any): void {
    setTimeout(() =>_.remove(this.kitchens, item), 50);
  }

  public selectedEmployees(): string[] {
    return _.map(this.employees,  'name');
  }

  public selectedService(): string[] {
    return _(this.subscriptionValue).map((s: string) => this.translate.instant(`SUBSCRIPTIONS.${s.toUpperCase()}`)).value()
  }


  public toParams(): any {
    return {
      date: {
        start: _.first(this.dateValue).format(this.format),
        end: _.last(this.dateValue).format(this.format),
      },
      employees: _.map(this.employees, 'id'),
      companies: _.map(this.companies, 'id'),
      kitchens: _.map(this.kitchens, 'id'),
      subscriptions: this.subscriptionValue,
      cardCharges: this.cardCharges,
      kitchenInvoices: this.kitchenInvoices,
      companyInvoices: this.companyInvoices,
      delivery: this.delivery
    };
  }
}
