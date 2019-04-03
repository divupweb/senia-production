import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminCompaniesService, AdminKitchensService } from 'app/admin/services'
import { CompanyAuthService } from 'app/shared/auth/company-register';
import {
  ValidationService,
  ToastService,
  CompanyInfoApiService,
  ObjectLoader
} from 'app/services';
import { CompanyValidator } from './company-validator.service';
import { AdminCompanyForm } from './admin-company-form';
import { Mixin } from "app/helpers/decorators/mixin";

@Component({
  selector: 'admin-new-company',
  providers: [
    AdminCompaniesService,
    CompanyAuthService,
    CompanyValidator,
    CompanyInfoApiService
  ],
  styleUrls: ['company-form.scss'],
  templateUrl: './company-form.html'
})
@Mixin([AdminCompanyForm])
export class AdminNewCompanyComponent {
  // common
  form: FormGroup;
  subscribeToCompanyInfo: any;

  // Fuckin mixin
  initForm: () => {};
  onInit: () => {};

  // custom
  backLink = ['..'];
  editMode = false;
  showInvoiceButton = false;
  displayUserForm = true;
  showChargePeriod = false;

  // New form only
  adminForm: FormGroup;

  constructor(
    private service: AdminCompaniesService,
    private fb: FormBuilder,
    private toast: ToastService,
    private _validator: CompanyValidator,
    public router: Router,
    public route: ActivatedRoute,
    private companyInfoApi: CompanyInfoApiService,
    private kitchensApi: AdminKitchensService) {
    this.initForm();
    this.extendForm();
  }

  ngOnInit() {
    this.onInit();
    this.subscribeToCompanyInfo();
  }

  private extendForm() {
    this.adminForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, ValidationService.emailValidator])]
    });
  }

  submitApi(value) {
    return this.service.create(value)
  }
}
