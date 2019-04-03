import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { CompanySettingsApiService } from "../company-settings-api.service"
import {
  CompanyLogoChangedService,
  CompanyImageApiService
} from "../../services"
import {
  AppStateService,
  ToastService,
  ValidationService,
  Uploadable
 } from "app/services";
import { Mixin } from "app/helpers";
import {TranslateService} from "@ngx-translate/core";
import { CreditCard, Paypal } from 'app/shared';

@Component({
  selector: 'admin-company-settings',
  providers: [ CompanySettingsApiService ],
  styleUrls: ['admin-company-settings.scss'],
  templateUrl: './admin-company-settings.html'
})

@Mixin([Uploadable])
export class AdminCompanySettingsComponent implements Uploadable {
  public initUploader: (uploader: string, url: string, onResponse: (arg: any) => void) => void;
  public logoUploader: FileUploader;
  public logoUploaderFile: boolean = false;
  public logoUploaderProgress: number = 0;
  adminForm: any;
  displayUrl;
  company;
  public uploader: FileUploader;
  constructor(private formBuilder: FormBuilder,
              private toast: ToastService,
              private service: CompanySettingsApiService,
              private imageService: CompanyImageApiService,
              private logoService: CompanyLogoChangedService,
              private appState: AppStateService,
              protected translate: TranslateService,
              private cc: CreditCard,
              private paypal: Paypal) {
                this.subscribeToCardUpdate();
                // TODO uncomment when Paypal integration ready
                // this.subscribeToPaypalUpdate();
              }

  ngOnInit() {
    this.initUploader('logoUploader', this.imageService.url(),
      (data) => {
        if (data.errors && data.errors.file) {
          this.toast.error(data.errors.file.join(','));
        } else {
          this.displayUrl = data.display_url;
          this.emitLogoChange();
        }
    });
    this.initForm();
    this.initCompany();
  }

  update() {
    if (this.adminForm.valid) {
      this.service.update(this.adminForm.value).subscribe(
        (response) => {
          this.toast.success(this.translate.instant('TOAST.SUCCESS.CHANGES_SAVED'));
          this.updateForm(response)
        },
        (error) => {
          this.toast.error(error)
        }
      )
    }
  }

  deleteLogo() {
    if (this.displayUrl) {
      this.imageService.delete().subscribe(
        () => {
          this.displayUrl = null;
          this.emitLogoChange();
        },
        (error) => this.toast.error(error)
      )
    }
  }

  private
  initForm() {
    this.adminForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      address2: [''],
      floor: [''],
      zipCode: ['', Validators.required],
      bankAccount: ['', Validators.required]
    });
    this.service.get().subscribe(
      (response) => {
        this.displayUrl = response.display_url;
        this.updateForm(response)
      },
      (error) => this.toast.error(error)
    )
  }

  updateForm(response) {
    this.adminForm.controls.email.setValue(response.email);
    this.adminForm.controls.phone.setValue(response.phone);
    this.adminForm.controls.address.setValue(response.address);
    this.adminForm.controls.address2.setValue(response.address2);
    this.adminForm.controls.floor.setValue(response.floor);
    this.adminForm.controls.zipCode.setValue(response.zip_code);
    this.adminForm.controls.bankAccount.setValue(response.bank_account);
  }

  emitLogoChange() {
    this.logoService.emitDisplayUrl(this.displayUrl)
  }

  private initCompany() {
    this.company = this.appState.currentCompany();
  }

  cardButton() {
    return this.company.credit_card ? 'Edit' : 'Add'
  }

  editCard() {
    this.cc.openNets()
  }

  editPaypal() {
    this.paypal.openPaypal();
  }

  private subscribeToPaypalUpdate() {
    this.paypal.paypalEmitted$.subscribe(
      (paypal) => {
        if (_.isObject(paypal)) {
          this.company.paypal = paypal.paypal;
          this.appState.set('company', this.company)
          this.disableWelcomePopup();
          this.toast.success(this.translate.instant('TOAST.SUCCESS.PAYPAL_SAVED'))
        } else {
          this.toast.error(paypal)
        }
      },
      (error) => this.toast.error(error)
    )
  }

  private subscribeToCardUpdate() {
    this.cc.ccEmitted$.subscribe(
      (creditCard) => {
        if (_.isObject(creditCard)) {
          this.company.credit_card = creditCard;
          this.appState.set('company', this.company)
          this.disableWelcomePopup();
          this.toast.success(this.translate.instant('TOAST.SUCCESS.CARD_SAVED'))
        } else {
          this.toast.error(creditCard)
        }
      },
      (error) => this.toast.error(error)
    )
  }

  private disableWelcomePopup() {
    let user = this.appState.currentUser();
    if (user.welcome_popup) {
      user.welcome_popup = false
      this.appState.set('current', user)
    }
  }
}
