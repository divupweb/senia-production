import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {AbstractPopupComponent} from "app/shared";
import {ManualOrdersApiService} from "./manual-orders-api.service";
import { Company, Dish, Employee} from "./models";
import {Forms, ObjectLoader, ToastService} from "app/services";
import { FormControl, FormGroup, Validators} from "@angular/forms";
import {DropdownComponent} from "app/helpers/dropdown";
import {TranslateService} from "@ngx-translate/core";

@Component({
  providers: [ManualOrdersApiService],
  selector: 'manual-orders',
  styleUrls: ['./manual-order.scss'],
  templateUrl: './manual-order.html',
})

export class ManualOrdersComponent extends AbstractPopupComponent implements OnInit {

  public companies: Company[] = [];

  @Input()
  public date: Date|any = moment();

  @ViewChild('dropdown')
  public dropdown: DropdownComponent;

  public dishes: Dish[] = [];

  public form: FormGroup;

  @Input()
  public subscription: string;

  public selectedOwner: Company|Employee|null;

  public searchDish: string;

  public total: { dishes: number, amount: number, subsidy: number } = { dishes: 0, amount: 0, subsidy: 0 };

  @Output()
  public onSuccess: EventEmitter<any> = new EventEmitter();
  public ownerQuery: string;

  public updateDishList: any = (query: string) => this.service.getDishes(this.subscription, query);

  protected timeout: any;

  public constructor(protected service: ManualOrdersApiService,
                     protected toast: ToastService,
                     protected translate: TranslateService
  ) {
    super()
  }

  public afterClose(): void {
    this.cleanUpComponent();
  }

  public beforeShow(): void {
    this.loadOwners();
  }

  public calcTotal(): void {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.service.getTotal(this.params())
      .subscribe((data) => {
        this.total.subsidy = data.subsidy_value;
        this.total.amount = 0;
        this.total.dishes = 0;
        _(data.order_dishes).each((d) => {
          this.total.dishes += d.quantity;
          this.total.amount += parseFloat(d.price);
        })
      }), 400);
  }

  public clearSearch(): void {
    this.dropdown.clearSearch();
  }

  public loadOwners(query: string| null = null): void {
    this.service.getOwners(this.subscription, query).subscribe(
      (companies: JSON) => {
        this.companies = _.map(companies, (c: JSON) => new Company(ObjectLoader.toCamelCase(c)));
        this.ownerQuery = query;
      }, (error) => this.toast.error(error)
    );
  }

  public ngOnInit(): void {
    this.buildForm();
  }

  public onChange(item: any): void {
    this.clearSearch();
    if (!_.find(this.dishes, { dishId: item.id })) {
      this.dishes.push(new Dish(ObjectLoader.toCamelCase(item)));
      this.calcTotal();
    }
  }

  public onSelect(owner: Company|Employee): void {
    this.selectedOwner = owner;
    this.form.patchValue(_.pick(owner.attributes(), ['ownerType', 'ownerId']));
  }

  public onQueryChange(value: string): void {
    this.loadOwners(value);
  }

  public removeDish(item: any): void {
    setTimeout(() => {
      const d = _.remove(this.dishes, item);
      this.calcTotal();
    }, 50);
  }

  public removeSelectedOwner(): void {
    setTimeout(() => this.selectedOwner = null);
    ['ownerType', 'ownerId'].forEach((controlName: string) => this.form.get(controlName).reset());
  }

  public params(): any {
    return {
      order: _.merge(_.clone(this.form.value), {
        orderDishesAttributes: this.dishes.map((d: Dish) => d.params())
      }),
      subscription: this.subscription
    }
  }

  public save(): void {
    if (Forms.invalid(this.form)) {
      return;
    }
    this.service.saveOrder(this.params())
      .subscribe((data) => {
        this.onSuccess.emit(data);
        this.close();
        this.toast.success(this.translate.instant('TOAST.SUCCESS.CHANGES_SAVED'));
      }, (error) => this.toast.error(error))
  }

  protected buildForm(): void {
    this.form = new FormGroup({
      ownerType: new FormControl(null, Validators.required),
      ownerId: new FormControl(null, Validators.required),
      date: new FormControl(this.date, Validators.required),
    });
  }

  protected cleanUpComponent(): void {
    this.companies = this.dishes = [];
    this.removeSelectedOwner();
  }

}
