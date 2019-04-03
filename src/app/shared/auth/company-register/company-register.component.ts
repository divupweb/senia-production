import {Component, Output, EventEmitter, ViewChild, Input, Renderer2} from '@angular/core';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {CompanyAuthService} from './company-auth.service';
import {LoginFormRequestService} from "app/home/shared";
import { DecisionMakerApiService } from 'app/shared/components/decision-maker'
import {
  ValidationService,
  Analytics,
  AppStateService, AccountsProxy, WindowRef
} from 'app/services';
import {NearestLocationService} from "app/services/nearest-location.service";
import {DropdownComponent} from "app/helpers/dropdown";

@Component({
  selector: 'company-register',
  providers: [CompanyAuthService],
  templateUrl: './company-register.html',
  styleUrls: ['../home-auth.scss', 'company-register.scss', '../../../helpers/custom-checkbox/custom-checkbox.scss']
})

export class CompanyRegisterComponent {
  @Output() onRegister = new EventEmitter();
  public companyForm: FormGroup;
  public show: boolean = false;

  @Input()
  public presetRegion: string | null = null;
  public dropdownReadonly: boolean = true;
  @ViewChild('dropdown')
  public dropdown: DropdownComponent;


  constructor(private _formBuilder: FormBuilder,
              public auth: CompanyAuthService,
              private accountProxy: AccountsProxy,
              private analytics: Analytics,
              private router: Router,
              private state: AppStateService,
              private renderer: Renderer2,
              protected nearestLocation: NearestLocationService,
              public decision: DecisionMakerApiService,
              public loginForm: LoginFormRequestService) {
  }


  updateAccountList = () => this.accountProxy.getAll();


  ngOnInit() {
    this.buildCompanyForm();
    if (this.presetRegion) {
      this.companyForm.get('accountName').setValue(this.presetRegion);
    }
  }

  buildCompanyForm() {
    this.companyForm = this._formBuilder.group({
      accountName: ['', Validators.required],
      accountId: null,
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
      receiveEmail: [''],
      agreeToc: ['', Validators.required],
      agreePp: ['', Validators.required]
    }, {
      validator: ValidationService.matchPassword // your validation method
    });
  }

  private setAccount(name = '', id = null) {
    this.companyForm.controls.accountName.setValue(name);
    this.companyForm.controls.accountId.setValue(id);
  }


  onSubmit() {
    _.each(this.companyForm.controls, (c) => c.markAsTouched());
    if (!this.companyForm.valid) return;
    let formData = this.companyForm.value;
    this.auth.submitRegister(formData).subscribe(
      (data) => this.goToCompanyAdmin(data),
      (error) => this.companyForm.setErrors(error)
    );
  }

  // account
  onChange(option) {
    if (option.id) {
      this.dropdownReadonly = true;
      const account = option;
      this.setAccount(account.name, account.id);
    } else {
      this.dropdownReadonly = false;
      this.companyForm.get('accountName').reset();
      this.companyForm.get('accountId').reset();
      this.dropdown.nativeElement.focus();
      this.dropdown.closeDropdown();
    }

  }

  onClear() {
    this.setAccount();
  }

  onTyping($event) {
    this.companyForm.controls.accountId.setValue(null);
    this.companyForm.get('accountName').setValue($event);
  }


  // Close - open
  open() {
    if (!this.presetRegion) {
      this.setUpNearestRegion();
    }

    setTimeout(() => this.show = true, 50);
    if (this.renderer) {
      this.renderer.addClass(document.documentElement, 'absolute-overlay');
      this.renderer.setStyle(document.querySelector('home-header'), 'z-index', '-1');
    }
  }

  close() {
    this.show = false;
    this.renderer.removeClass(document.documentElement, 'absolute-overlay');
    this.renderer.removeStyle(document.querySelector('home-header'), 'z-index');
  }

  goToCompanyAdmin(data) {
    this.onRegister.next(data.company.name);
    this.analytics.signUpAsCompany(data);
    WindowRef.nativeWindow.fbq('track', 'CompleteRegistration');
    this.state.setAccount(data.account);
    this.state.set('current', data.user);
    this.state.set('company', data.company);
    this.router.navigate(['company', 'dashboard'], {queryParams: {new: 1}})
  }

  openDecision() {
    this.close();
    this.decision.open();
  }

  protected setUpNearestRegion(): void {
    this.nearestLocation.get().subscribe((account: any) => {
      this.setAccount(account.name, account.id);
    });
  }
}
