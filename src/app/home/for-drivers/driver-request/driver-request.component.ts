import {Component, Output, EventEmitter, ViewChild, Input, Renderer2} from '@angular/core';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {DriverRequestApiService} from './driver-request-api.service';
import { ValidationService, ToastService } from 'app/services';

@Component({
  selector: 'driver-request',
  providers: [DriverRequestApiService],
  templateUrl: './driver-request.html',
  styleUrls: ['../../../shared/auth/home-auth.scss','driver-request.scss']
})

export class DriverRequestComponent {
  public driverForm: FormGroup;
  public show: boolean = false;
  constructor(private _formBuilder: FormBuilder,
              public service: DriverRequestApiService,
              public toast: ToastService,
              public renderer: Renderer2) {}

  ngOnInit() {
    this.buildDriverForm();
  }

  private buildDriverForm() {
    this.driverForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', ValidationService.emailValidator],
      phone: ['', Validators.required],
    });
  }

  onSubmit() {
    this.driverForm.markAsTouched();
    if (!this.driverForm.valid) return;
    this.service.submit(this.driverForm.value).subscribe(
      (data) => {
        this.close();
        this.toast.info("Request sent");
      },
      (error) => this.toast.error(error)
    );
  }

  open() {
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
}
