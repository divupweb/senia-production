import { Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {AuthService, ToastService, ValidationService} from "app/services";
import { EmployeeConfirmationApiService } from './employee-confirmation-api.service';
import { TermsAndConditionsService } from '../shared';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'employee-confirmation',
  providers: [ ],
  templateUrl: './employee-confirmation.html',
  styleUrls: ['employee-confirmation.scss', '../shared/auth/employee-register/employee-register.scss', '../shared/auth/home-auth.scss']
})

export class EmployeeConfirmationComponent implements OnInit {
  constructor(private _formBuilder: FormBuilder,
              private _employeeConfirmationApi: EmployeeConfirmationApiService,
              private toastService: ToastService,
              private _auth: AuthService,
              private activatedRoute: ActivatedRoute,
              private tocState: TermsAndConditionsService,
              protected translate: TranslateService) {}

  public employeeForm: FormGroup;
  public employeeToken: string = '';
  public logisticsUser: boolean = false;

  public loadingState: boolean = false;
  public showToc: boolean = false;

  ngOnInit() {
    this.readParams();
    this.buildEmployeeForm();
  }

  private readParams() {
    let snapshot = this.activatedRoute.snapshot;
    this.employeeToken = snapshot.params['employeeToken'];
    this.logisticsUser = !!snapshot.params['logistics'];
    this.showToc = !snapshot.queryParams.hasOwnProperty('no_toc');
  }

  buildEmployeeForm() {
    this.employeeForm = this._formBuilder.group({
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required]
    }, { validator: ValidationService.matchPassword });
    if (this.showToc) {
      this.employeeForm.addControl('toc', new FormControl(false, Validators.requiredTrue))
    }
  }

  setPassword() {
    this.loadingState = true;
    this._employeeConfirmationApi.confirm(this.employeeToken, this.employeeForm.value).subscribe(
      () => {
        this.toastService.success(this.translate.instant('TOAST.SUCCESS.PASSWORD_SET'));
        this._auth.currentUser(1);
      },
      (error) => {
        this.toastService.error(error);
        setTimeout(() => this.loadingState = false, 500);
      }
    );
  }

  public showModal(event): void {
    event.preventDefault();
    this.tocState.open();
  }
}
