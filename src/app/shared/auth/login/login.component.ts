import { Component, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ForgotPasswordService } from './forgot-password.service';

import {
  AuthService,
  ValidationService,
  ToastService
} from 'app/services';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'login',
  providers: [AuthService, ForgotPasswordService],
  templateUrl: './login.html',
  styleUrls: [ '../home-auth.scss', 'login.scss']
})

export class LoginComponent {

  public state: boolean = false;
  loginForm: FormGroup;
  public loadingState: boolean = false;

  constructor(
    public auth: AuthService,
    private _formBuilder: FormBuilder,
    private forgotApi: ForgotPasswordService,
    private toast: ToastService,
    protected translate: TranslateService,
    private renderer: Renderer2
  ) {
    this.loginForm = this._formBuilder.group({
      email:     ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      password:        ['', Validators.required]
    });
  }





  public close(): void {
    this.state = false;
    this.renderer.removeClass(document.documentElement, 'absolute-overlay');
  }

  public open(): void {
    setTimeout(() => this.state = true, 100);
    this.renderer.addClass(document.documentElement, 'absolute-overlay');
  }

  submit() {
    this.loadingState = true;
    this.auth.data = this.loginForm.value;
    this.auth.submitLogin().subscribe({
      error: (error) => {
        this.loginForm.setErrors(error.json());
        setTimeout(() => this.loadingState = false, 500);
      }
    });
    this.renderer.removeClass(document.documentElement, 'absolute-overlay');
  }

  forgotPassword() {
    if (this.loginForm.controls.email.valid) {
      this.forgotApi.post(_.pick(this.loginForm.value, 'email')).subscribe(
        (response) => {
          this.toast.success(this.translate.instant('TOAST.SUCCESS.RESET_LINK_SENT'))
        },
        (error) => {
          this.toast.error(error)
        }
      )
    }
    this.renderer.removeClass(document.documentElement, 'absolute-overlay');
  }
}
