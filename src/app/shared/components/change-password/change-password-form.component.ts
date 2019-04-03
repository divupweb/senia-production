import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastService, AuthService } from 'app/services';
import {TranslateService} from "@ngx-translate/core";
import {AbstractPopupComponent} from "app/shared/components/popup";

@Component({
  selector: 'change-password',
  templateUrl: './change-password.html'
})

export class ChangePasswordFormComponent extends AbstractPopupComponent implements OnInit {
  public form: FormGroup;

  @Output()
  public onSuccess: EventEmitter<any> = new EventEmitter();

  @Output()
  public onError: EventEmitter<any> = new EventEmitter();

  public constructor(protected service: AuthService,
                     protected formBuilder: FormBuilder,
                     protected toast: ToastService,
                     protected translate: TranslateService) {
    super();
  }

  public ngOnInit(): void {
    this.buildForm();
  }

  public submitForm(): void {
    this.service.changePassword(_.mapKeys(this.form.value, (v: any, k: string) => _.snakeCase(k)))
      .subscribe((n) => {
        this.toast.success(this.translate.instant('TOAST.SUCCESS.PASSWORD_CHANGED'));
        this.onSuccess.next(n)
      }, (error) => {
        this.toast.error(error);
        this.onError.next(error);
      })
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
    });
  }
}
