import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { RegisterEmployeeService } from './employee-register.service';

import {
  ValidationService,
  AuthService,
  Analytics, ToastService
} from 'app/services';
import { TermsAndConditionsService } from 'app/shared';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'employee-register',
  providers: [RegisterEmployeeService],
  templateUrl: './employee-register.html',
  styleUrls: [ '../home-auth.scss', 'employee-register.scss' ]
})

export class EmployeeRegisterComponent implements OnInit  {
  public pin: string = "";
  employeeForm: FormGroup;

  constructor(protected _formBuilder: FormBuilder,
              public service: RegisterEmployeeService,
              protected auth: AuthService,
              protected analytics: Analytics,
              protected tocState: TermsAndConditionsService,
              protected route: ActivatedRoute,
              protected toast: ToastService
  ) {
    this.pin = this.route.snapshot.queryParams['pin'];
    this.employeeForm = this._formBuilder.group({
      email: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      pin_code: ['', Validators.required],
      password: ['', Validators.required],
      toc: [false, Validators.compose([Validators.required, ValidationService.checked])]
    });

    tocState.update.subscribe(
      (status) => this.onTocStateChange(status)
    )
  }

  ngOnInit() {
    this.employeeForm.get(['pin_code']).setValue(this.pin);
  }

  register() {
    if (this.employeeForm.dirty && this.employeeForm.valid) {
      this.auth.handleResponse(this.service.create(this.employeeForm.value), 1)
        .subscribe((data: any) => this.analytics.signUpAsEmployee(data),
          (error) => this.toast.error(error)
        );
    }
  }

  public showModal(event): void {
    event.preventDefault();
    this.tocState.open();
  }

  private onTocStateChange(status) {
    if (!status) this.employeeForm.controls.toc.setValue(true);
  }
}
