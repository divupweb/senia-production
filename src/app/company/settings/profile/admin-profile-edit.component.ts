import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { AdminProfileApiService } from "./admin-profile-api.service";
import { AuthService, ObjectLoader, ToastService, ValidationService} from 'app/services';
import {TranslateService} from "@ngx-translate/core";
import {UserStateService} from "app/user/services";

@Component({
  providers: [AdminProfileApiService],
  selector: 'admin-profile-edit',
  styleUrls: ['admin-profile-edit.scss'],
  templateUrl: './admin-profile-edit.html'
})

export class AdminProfileEditComponent implements OnInit {
  public form: FormGroup;

  protected codesForHandling = [422];
  constructor(protected auth: AuthService,
              protected toast: ToastService,
              protected state: UserStateService,
              protected translate: TranslateService,
              protected api: AdminProfileApiService,
  ) {}

  public ngOnInit(): void {
    this.api.get().subscribe((user) => this.buildForm(user), (error) => this.toast.error(error))
  }
  public submit(): void {
    this.api.update(ObjectLoader.toSnakeCase(this.form.value))
      .subscribe((user) => {
         this.toast.success(this.translate.instant('TOAST.SUCCESS.UPDATED'));
         const currentUser = this.state.getUser();
         if (currentUser.id == user['id']) {
           this.state.setUser(user);
         }
        }, (error) => {
          if (_.includes(this.codesForHandling, error.status)) {
            this.form.setErrors(ObjectLoader.toCamelCase(error.json()));
          } else {
            this.toast.error(error);
          }
        }
      );
  }

  protected buildForm(user: any): void {
    this.form = new FormGroup({
      firstName: new FormControl(user.first_name),
      lastName: new FormControl(user.last_name),
      phone: new FormControl(user.phone),
      email: new FormControl(user.email, Validators.compose([ValidationService.emailValidator, Validators.required]))
    });
  }
}
