import {Component, ViewChild, Input} from '@angular/core';
import {EmployeeRegisterComponent} from "app/shared/auth/employee-register";
import {RegisterEmployeeService} from "app/shared/auth/employee-register/employee-register.service";
import {CompaniesPopupComponent} from "app/enterprise-region/sign-up";
import {EnterpriseRegionApiService} from "../enterprise-region-api.service"
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  ValidationService,
  AuthService,
  Analytics, ToastService
} from 'app/services';
import { TermsAndConditionsService } from 'app/shared';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'sign-up',
  providers: [RegisterEmployeeService],
  templateUrl: './sign-up.html',
  styleUrls: [ '../../shared/auth/home-auth.scss', 'sign-up.scss' ]
})

export class SignUpComponent extends EmployeeRegisterComponent {

  @ViewChild('popup')
  logo;
  public popup: CompaniesPopupComponent;

  public company: any;

  constructor(protected _formBuilder: FormBuilder,
              public service: RegisterEmployeeService,
              protected auth: AuthService,
              protected analytics: Analytics,
              protected tocState: TermsAndConditionsService,
              protected route: ActivatedRoute,
              protected toast: ToastService,
              protected enterpriseService: EnterpriseRegionApiService) {
                super(_formBuilder, service, auth, analytics, tocState, route, toast);
              }

  ngOnInit() {
    this.logo = this.enterpriseService.getLogoUrl()
  }

  public onSelect(company: any): void {
    this.company = company;
    this.employeeForm.get('pin_code').setValue(this.company['pin_code']);
    this.popup.close();
  }
}
