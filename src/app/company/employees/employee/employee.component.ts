import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import {
  EmployeesProxyService,
  SubscriptionsProxyService,
  SubsidiesProxyService
} from '../shared/proxies';
import { ToastService, ObjectLoader, AppStateService, Forms } from 'app/services';
import { SubsidiesData } from "../shared";
import { TranslateService } from "@ngx-translate/core";
import { Subsidy } from "app/company/models";


@Component({
  selector: 'employee',
  providers: [ SubsidiesData ],
  templateUrl: './employee.html',
  styleUrls: ['employee.scss']
})

export class EmployeeComponent {
  public employee: any;
  public employeeForm: any;
  public employeeSubscriptions = {};
  public employeeSubsidies: any[] = [];
  public companySubscriptions: any = {};
  public breakfastTitle: string = 'breakfast';
  public dinnerTitle: string = 'dinner';
  public lunchTitle: string = 'lunch';
  public isFormDirty: boolean = false;

  constructor(
    public proxy: EmployeesProxyService,
    public formBuilder: FormBuilder,
    public toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    public subscriptionProxy: SubscriptionsProxyService,
    protected translate: TranslateService,
    public subsidyData: SubsidiesData,
    private subsidyProxy: SubsidiesProxyService,
    private state: AppStateService) {}


  ngOnInit(): void {
    this.employee = {};
    this.initForm();
    this.subscriptionProxy.getAll().subscribe(() => {
      this.companySubscriptions = this.subscriptionProxy.subscriptions;
      this.subsidyData.load().subscribe(() => {
        this.employeeSubsidies = [];
        this.employeeSubscriptions = {};
        this.route.params.subscribe((params) => this.initUser(params));
      })
      }, (error) => this.toastService.error(error));
  }


  submit(): void {
    if (Forms.invalid(this.employeeForm)) return;
    if (!this.isNew()) {
      this.updateEmployee(this.employee.id);
    } else {
      this.createEmployee();
    }
  }

  formChange(): void {
    this.isFormDirty = true;
  }

  initForm(): void {
    this.employeeForm = this.formBuilder.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: [''],
      phone: [''],
    });
    this.isFormDirty = false;
  }

  resetForm(): void {
    this.resetSettings();
    this.initForm();
  }

  resetSettings(): void {
    this._setSubscriptions();
    this._setSubsidy();
    this.formChange();
  }

  updateEmployee(id): void {
    this.proxy.update(id, this.employeeForm.value, this.customSubsidies(), this.employeeSubscriptions)
      .subscribe((response) => {
        this._setSubsidy(response.subsidies);
        this._setSubscriptions(response.subscriptions);
        this.toastService.success(this.translate.instant('TOAST.SUCCESS.UPDATED'));
      }, (error) => {
        this.errorHandle(error);
      });
  }

  createEmployee(): void {
    this.proxy.create(this.employeeForm.value, this.customSubsidies(), this.employeeSubscriptions)
      .subscribe(() => {
        this.toastService.success(this.translate.instant('TOAST.SUCCESS.CREATED'));
        this.resetForm();
      }, (error) => {
        this.errorHandle(error);
      })
  }

  removeEmployee(): void {
    this.proxy.remove(this.employee.id)
      .subscribe(() => {
        this.toastService.success(this.translate.instant('TOAST.SUCCESS.REMOVED'));
        this.router.navigate(['../../employee'], { relativeTo: this.route });
      }, (error) => {
        this.errorHandle(error);
      })

  }

  isNew(): boolean {
    return !this.employee.id
  }

  errorHandle(error): void {
    let errorText = error.json();
    this.toastService.error(errorText);
    _.each(['firstName', 'lastName', 'phone', 'email'], (key) => {
      if (errorText[key]) {
        this.employeeForm.controls[key].setErrors({server: errorText[key]});
      }
    });

  }

  allowedDays(type): number[] {
    return _(this.companySubscriptions).get(`${type}.days`, [])
  }

  private _setSubscriptions(subscriptions: any[] = null): void {
    _.each([this.breakfastTitle, this.lunchTitle, this.dinnerTitle], (type) => {
      let userSubscription: any = _.find(subscriptions, { subscription_type: type });
      let companySubscription: any = _.get(this.companySubscriptions, type);
      if (companySubscription) {
         const subscription = userSubscription || { days: _.cloneDeep(companySubscription.days),
            type: `${_.upperFirst(type)}EmployeeSubscription`,
            company_subscription_id: companySubscription.id,
            user_id: this.employee.id };
         if (_.isEmpty(this.employeeSubscriptions[type])) {
           this.employeeSubscriptions[type] = subscription;
         } else {
           _.merge(this.employeeSubscriptions[type], subscription);
         }
       }
    });
  }

  private _setSubsidy(subsidies: any[] = []): void {
    subsidies = ObjectLoader.toCamelCase(subsidies);
    this.employeeSubsidies = _.map(this.subsidyData.data, (companySubsidy) => {
      let employeeSubsidy = _.find(subsidies, { type: companySubsidy.type });
      let json;
      if (employeeSubsidy && employeeSubsidy.active) {
        json = employeeSubsidy;
      } else {
        let companySubsidyParams = _.omit(companySubsidy.params(), 'id');
        json = _.merge(companySubsidyParams, _.pick(employeeSubsidy, 'id'));
      }

      return this.createSubsidy(json);
    });
  }

  private initUser(params: any): void {
    const userId = params.id;
    this.employeeSubsidies = [];
    this.employeeSubscriptions = {};
    if (userId) {
      this.employeeSubscriptions = {};
      this.employeeSubsidies = [];
      this.proxy.get(userId)
        .subscribe((response) => {
          this.initForm();
          this.employee = response.employee;
          this.employeeForm.controls.email.setValue(response.employee.email);
          this.employeeForm.controls.firstName.setValue(response.employee.first_name);
          this.employeeForm.controls.lastName.setValue(response.employee.last_name);
          this.employeeForm.controls.phone.setValue(response.employee.phone);
          this._setSubscriptions(response.subscriptions);
          this._setSubsidy(response.subsidies);
        }, (error) => this.toastService.error(error))
    } else {
      this._setSubscriptions();
      this._setSubsidy();
    }
  }

  private customSubsidies(): any[] {
    let params = _.map(this.employeeSubsidies, (s) => {
      let value = s.params();
      const companySubsidy = _.find(this.subsidyData.data, { subscriptionType: s.subscriptionType });
      if (companySubsidy) value.active = !s.isEqual(companySubsidy);
      return value;
    })


    return params.filter((sub: any) => sub.active || !!sub.id);
  }

  canBeRemoved() {
    return !(this.isNew() || this.employee.company_admin);
  }

  private createSubsidy(json) {
    return new Subsidy(
      json,
      this.translate,
      this.subsidyProxy.valueTypes(),
      this.subsidyProxy.periods(),
      this.state
    );
  }
}
