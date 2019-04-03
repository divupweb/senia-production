import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DashboardApiService } from 'app/company/dashboard';
import { ToastService, AppStateService, ValidationService, CompanyInfoApiService, Forms } from "app/services";
import { CreditCard } from 'app/shared/components/credit-card';
import { Paypal } from 'app/shared/components/paypal';
import { SlideInOut } from 'app/shared/animations';
import { TranslateService } from "@ngx-translate/core";
import { CompanyUpdateService } from 'app/company/services';

@Component({
  selector: 'compamy-welcome-popup',
  templateUrl: './welcome-popup.html',
  providers: [CompanyInfoApiService],
  styleUrls: ['welcome-popup.scss'],
  animations: [ SlideInOut.animation ]
})

export class WelcomePopupComponent {
  company;
  companyForm;
  cardForm;
  showPopup;
  user;
  option = -1;

  constructor(private formBuilder: FormBuilder,
              private service: DashboardApiService,
              private toast: ToastService,
              private state: AppStateService,
              protected translate: TranslateService,
              private companyInfoApi: CompanyInfoApiService,
              private companyUpdate: CompanyUpdateService,
              private cc: CreditCard,
              private paypal: Paypal,) {
    this.companyUpdate.welcomePopup.subscribe(
      (data) => this.checkShowState(data)
    )
  }

  ngOnInit() {
    this.checkShowState(false); // first check
  }

  private checkShowState(force = true) {
    this.company = this.state.currentCompany();
    if (!this.company) return;
    this.showPopup = force || !this.company.can_edit_orders;
    if (this.showPopup) {
      this.buildCompanyForm();
      this.buildCardForm();
      this.subscribeToCardUpdate();
      this.subscribeToCompanyInfo();
      this.subscribeToPaypalUpdate();
    }
  }

  waitForApproval() {
    return !!this.company &&
           !this.company.can_edit_orders &&
           this.company.address &&
           this.company.zip_code &&
           this.company.organization_number;
  }

  private buildCompanyForm() {
    this.companyForm = this.formBuilder.group({
      name: ['', Validators.required],
      organization_number: [this.company ? this.company.organization_number : '', Validators.required],
      email: [this.company ? this.company.email : '', Validators.compose([Validators.required, ValidationService.emailValidator])],
      address: [this.company ? this.company.address : '', Validators.required],
      zip_code: [this.company ? this.company.zip_code : '', Validators.required],
      floor: [this.company ? this.company.floor : '']
    })
  }

  private buildCardForm() {
    this.cardForm = this.formBuilder.group({
      address: [this.company ? this.company.address : '', Validators.required],
      zip_code: [this.company ? this.company.zip_code : '', Validators.required],
      floor: [this.company ? this.company.floor : '']
    })
  }

  cardButton() {
    return this.company.credit_card ? 'SHARED.MODES.EDIT' : 'SHARED.MODES.ADD_NEW'
  }

  editPayment(e, type) {
    e.preventDefault();
    if (Forms.invalid(this.cardForm)) return;

    let value = this.cardForm.value;
    let params = {
      location_attributes: {
        address: value.address,
        floor: value.floor,
        zip_code: value.zip_code
      }
    };

    type == 'card' ? this.cc.openNets() : this.paypal.openPaypal();
    this.service.updateCompany(params).subscribe(
      (response) => {
        this.company = response.company;
        this.state.set('company', this.company)
        this.closePopup();
      },
      (error) => this.toast.error(error)
    )
  }

  submit() {
    if (Forms.invalid(this.companyForm)) return;
    let value = this.companyForm.value;
    let params = {
      organization_number: value.organization_number,
      name: value.name,
      email: value.email,
      location_attributes: {
        address: value.address,
        floor: value.floor,
        zip_code: value.zip_code
      }
    };
    this.service.updateCompany(params).subscribe(
      (response) => {
        this.company = response.company;
        this.state.set('company', this.company);
        this.companyUpdate.set(this.company);
        this.closePopup();
        this.toggleOption(0);
        this.toast.success(this.translate.instant('TOAST.SUCCESS.ORG_NUMBER_SAVED'), 10000)
      },
      (error) => this.toast.error(error)
    )
  }

  closePopup() {
    this.showPopup = false;
  }

  private subscribeToCardUpdate() {
    this.cc.ccEmitted$.subscribe(
      (creditCard) => {
        if (_.isObject(creditCard)) {
          this.company = this.state.currentCompany();
          this.company.credit_card = creditCard;
          this.companyPaymentAdded();
          this.toast.success(this.translate.instant('TOAST.SUCCESS.CARD_SAVED'));
        } else {
          this.toast.error(creditCard)
        }
      },
      (error) => this.toast.error(error)
    )
  }

  private subscribeToPaypalUpdate() {
    this.paypal.paypalEmitted$.subscribe(
      (message) => {
        if (_.isObject(message)) {
          this.company = this.state.currentCompany();
          this.company.paypal = message.paypal;
          this.companyPaymentAdded();
          this.toast.success(this.translate.instant('TOAST.SUCCESS.PAYPAL_SAVED'));
        } else {
          this.toast.error(message)
        }
      },
      (error) => this.toast.error(error)
    )
  }

  private companyPaymentAdded() {
    if (!this.company) return;
    this.company.can_edit_orders = true;
    this.state.set('company', this.company)
    this.companyUpdate.set(this.company);
    this.closePopup();
  }

  showCompanyInfo = false;
  companyInfo;
  private lastValue;

  private subscribeToCompanyInfo() {
    this.companyForm.controls.organization_number.valueChanges.subscribe(
      (value, v2) => {
        let parsedValue = this.parsedOrganizationNumber(value);
        if (parsedValue.length == 9 && this.lastValue != parsedValue) {
          this.lastValue = parsedValue;
          this.companyInfoApi.get(parsedValue).subscribe(
            (data) => {
              this.companyInfo = data;
              this.showCompanyInfo = true;
            },
            (error) => {
              this.removeCompanyInfo();
              console.error(error)
            }
          )
        }
      }
    )
  }

  private parsedOrganizationNumber(value = this.companyForm.controls.organizationNumber.value) {
    return String(value).replace(/[^0-9]/g, '').slice(0, 9);
  }

  onFocus() {
    this.showCompanyInfo = !!this.companyInfo;
  }

  onBlur() {
    setTimeout(() => { this.showCompanyInfo = false }, 100); // handle click after blur
  }

  fillInCompanyInfo() {
    let params = {
      name: this.companyInfo.company_name,
      address: this.companyInfo.address,
    }
    this.companyForm.patchValue(params);
    this.removeCompanyInfo();
  }

  private removeCompanyInfo() {
    this.showCompanyInfo = false;
    this.companyInfo = null;
  }

  toggleOption(value = null) {
    if (value == null) value = this.option == 0 ? 1 : 0;
    this.option = value;
  }
}
