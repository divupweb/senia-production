import {Component, Output} from '@angular/core';
import { EventEmitter } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {SuperAdminRegionsService} from "app/super-admin/services";
import {ObjectLoader} from "app/services";


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

  @Output()
  public onClickBack: EventEmitter<any> = new EventEmitter();

  public companyInvoices: boolean = true;
  public cardCharges: boolean = true;
  public kitchenInvoices: boolean = true;
  public delivery: boolean = true;

  public subscriptions: any[] = ['breakfast', 'lunch', 'dinner'];

  public accountList: any[] = [];

  public accounts: any[] = [];
  public accountOptions: boolean = false;
  public dateOptions: boolean = false;
  public subscriptionOptions: boolean = false;

  public dateValue: any|Date[];
  public subscriptionValue: string[] = _.clone(this.subscriptions);

  public defaultSelected: any|Date[];

  protected format = 'DD-MM-YYYY';

  public constructor(
    protected translate: TranslateService,
    protected accountsService: SuperAdminRegionsService
  ) {
    this.dateValue = [moment().startOf('day').subtract(7, 'days'), moment().startOf('day')];
  }

  public download(): void {
    this.onDownload.emit(this.toParams());
  }

  public submit(): void {
    this.onSubmit.emit(this.toParams());
  }

  public ngOnInit(): void {
    this.defaultSelected = _.clone(this.dateValue);
    this.loadAccounts();
  }

  public addAccount(item: any): void {
    this.accounts.push(item);
  }

  public setDate(range): void {
    this.dateValue = range;
    this.defaultSelected = _.cloneDeep(this.dateValue);
  }

  public closeOptions(type: string): void {
    this[type] = false;
  }

  public toggleState(type: string): void {
    this[type] = !this[type];
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

  public removeAccount(item: any): void {
    _.remove(this.accounts, item);
  }

  public selectedService(): string[] {
    return _(this.subscriptionValue).map((s: string) => this.translate.instant(`SUBSCRIPTIONS.${s.toUpperCase()}`)).value()
  }

  public selectedAccounts(): string[] {
    return _.map(this.accounts, 'name');
  }


  public toParams(): any {
    return {
      date: {
        start: _.first(this.dateValue).format(this.format),
        end: _.last(this.dateValue).format(this.format),
      },
      accounts: _.map(this.accounts, 'id'),
      subscriptions: this.subscriptionValue,
      cardCharges: this.cardCharges,
      kitchenInvoices: this.kitchenInvoices,
      companyInvoices: this.companyInvoices,
      delivery: this.delivery
    };
  }
  protected loadAccounts(): void {
    this.accountsService.getList({ all: true }).map(ObjectLoader.toCamelCase)
      .subscribe((data) => {
        this.accountList = data;
        this.accounts = _.clone(data);
      });
  }
}
