import { Component, OnInit } from '@angular/core'
import { ContactApiService} from "./contact-api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ObjectLoader, ToastService, ValidationService} from "app/services";

@Component({
  selector: 'contact-popup',
  templateUrl: './contact-popup.html',
  providers: [ContactApiService],
  styleUrls: ['../../../shared/auth/home-auth.scss' ,'contact-popup.scss']
})

export class ContactPopupComponent implements OnInit {

  public state: boolean = false;

  public form: FormGroup;

  public success: boolean = false;

  public constructor(protected api: ContactApiService, protected toast: ToastService) {}

  public ngOnInit(): void {
    this.buildForm();
  }

  public open(): void {
    this.form.reset();
    this.success = false;
    setTimeout(() => this.state = true, 50);
  }

  public close(): void {
    this.state = false;
  }

  public submit(): void {
    _.each(this.form.controls, (c: FormControl) => c.markAsTouched());
    if (this.form.valid) {
      this.api.submit(ObjectLoader.toSnakeCase(this.form.value))
        .subscribe(() => this.success = true, (error) => this.toast.error(error));
    }
  }

  protected buildForm(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl(''),
      email: new FormControl('', Validators.compose([Validators.required, ValidationService.emailValidator])),
      message: new FormControl('', Validators.required),
    })
  }

}
