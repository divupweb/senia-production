import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsersApiService } from "../../../../services/";
import { ToastService, ValidationService } from "../../../../../services/";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'kitchen-user-form',
  templateUrl: './user-form.html',
})

export class UserFormComponent {
  public userForm: FormGroup;
  public roles: string[] = ['Employee', 'Driver', 'Logistics', 'Admin'];
  public role: string = this.roles[0];
  public state: boolean = false;
  public user: any;

  @Output()
  public onCreate: EventEmitter<any> = new EventEmitter();

  @Output()
  public onUpdate: EventEmitter<any> = new EventEmitter();

  public constructor(protected service: UsersApiService,
                     protected formBuilder: FormBuilder,
                     protected toast: ToastService,
                     protected translate: TranslateService) {}

  public apply(user: any): UserFormComponent {
    this.user = user;
    this.buildForm();
    return this;
  }

  public show(): void {
    this.state = true;
  }

  public close(): void {
    this.state = false;
  }

  public submitForm(): void {
    const errorHandler = (error) => {
      this.toast.error(error);
      let form = this.userForm;
      form.controls['email'].setErrors({ server: _.first(error.json().email) });
    };
    const userParams = this.userForm.value;
    if (_.isInteger(userParams.id)) {
      this.service.update(userParams.id, userParams)
        .subscribe((user) => {
          this.onUpdate.next(user);
          this.toast.success(this.translate.instant('TOAST.SUCCESS.USER_UPDATED'));
        }, errorHandler)
    } else {
      this.service.create(userParams)
        .subscribe((user) => {
          this.onCreate.next(user);
          this.toast.success(this.translate.instant('TOAST.SUCCESS.USER_ADDED'));
        })
    }
  }

  protected serverErrors(param: string) {
    let errors: any = this.userForm.controls[param].errors;
    if (errors && errors.server) {
      return errors.server
    }
    return null;
  }

  protected buildForm(): void {
    this.userForm = this.formBuilder.group({
      id: [this.user.id],
      firstName: [this.user.first_name],
      lastName:  [this.user.last_name ],
      email:     [this.user.email, Validators.compose([Validators.required])],
      password:  [''],
      role:  ['', Validators.required]
    });
  }
}
