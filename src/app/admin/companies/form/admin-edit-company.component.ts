import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminCompaniesService, AdminKitchensService } from 'app/admin/services'
import { CompanyAuthService } from 'app/shared/auth/company-register';
import {
  ToastService,
  ValidationService,
  CompanyInfoApiService,
  ObjectLoader,
  AuthService,
  AppStateService
} from "app/services";
import { CompanyValidator } from './company-validator.service';
import { Invoices } from 'app/shared/invoices';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminCompanyForm } from './admin-company-form';
import { Mixin } from "app/helpers/decorators/mixin";
import { TranslateService } from "@ngx-translate/core";
import { CompanyBecome } from '../shared';
import { Company } from 'app/admin/models';

@Component({
  selector: 'admin-edit-company',
  providers: [
    AdminCompaniesService,
    CompanyAuthService,
    CompanyValidator,
    CompanyInfoApiService
  ],
  styleUrls: ['company-form.scss'],
  templateUrl: './company-form.html'
})
@Mixin([AdminCompanyForm, CompanyBecome])
export class AdminEditCompanyComponent extends Invoices {
  // common
  form: FormGroup;
  subscribeToCompanyInfo: any;
  relatedKitchen: any;
  imageDisplayUrl;
  loading = true;

  // Fuckin mixin
  initForm: () => {};
  onInit: () => {};
  fillCompanyKitchens: () => {};

  // custom
  editMode = true;
  backLink = ['../..'];
  showInvoiceButton = true;
  displayUserForm = false;
  showChargePeriod = true;

  // Edit form only
  id;
  @ViewChild('sendMessage') sendMessage;
  @ViewChild('companyDiscount') companyDiscount;
  @ViewChild('companyCredits') companyCredits;
  @ViewChild('becomeEmployee') becomeEmployee;
  @ViewChild('sharedLocation') sharedLocation;

  company: any = {};
  chargePeriods = [
    { id: 0, value: this.translate.instant("CONTROLS.EVERY_WEEK") },
    { id: 1, value: this.translate.instant("CONTROLS.TWICE_MONTH")},
    { id: 2, value: this.translate.instant("CONTROLS.ONCE_MONTH") },
    { id: 3, value: this.translate.instant("CONTROLS.INVOICE_MONTHLY") },
    { id: 4, value: this.translate.instant("CONTROLS.INVOICE_TWICE_A_MONTH") },
    { id: 5, value: this.translate.instant("CONTROLS.INVOCIE_WEEKLY") },];


  constructor(
    public service: AdminCompaniesService,
    private fb: FormBuilder,
    public toast: ToastService,
    private _validator: CompanyValidator,
    public router: Router,
    public route: ActivatedRoute,
    private companyInfoApi: CompanyInfoApiService,
    protected translate: TranslateService,
    private kitchensApi: AdminKitchensService,
    private auth: AuthService,
    private state: AppStateService) {
    super(service, toast, router, route, translate);
    this.id = _.get(this.route, 'snapshot.params.id');
    this.initForm();
  }

  ngOnInit() {
    this.onInit();
    this.loadCompany();
  }

  private loadCompany() {
    let ff = this.form;
    this.service.getItem(this.id).subscribe(
      (response) => {
        this.company = new Company(response);
        if (!this.company.validPayment) {
          this.chargePeriods = _.filter(this.chargePeriods, (obj) => _.includes([3, 4, 5], obj.id))
        }
        this.loading = false;
        this.relatedKitchen = this.company.relatedKitchen;
        this.imageDisplayUrl = this.company.displayUrl;

        let obj = { locationAttributes: {} };
        Object.assign(obj, this.company);
        ['address',
        'address2',
        'floor',
        'city',
        'country',
          'zipCode'].forEach((e) => obj.locationAttributes[e] = obj[e]);
        this.form.patchValue(obj);
        this.fillCompanyKitchens();

        this.subscribeToCompanyInfo();
      },
      (error) => this.toast.error(error)
    );
  }

  handleCreditsChange(event) {
    this.company.balance = event.value;
  }

  submitApi(value) {
    return this.service.update(this.id, value)
  }

  onSharedLocationUpdate(event) {
    let shared = _.some(event.companies, { id: this.id });
    if (shared) {
      this.company.sharedLocationId = event.id
    } else {
      this.company.sharedLocationId = undefined;
    }
  }
}
