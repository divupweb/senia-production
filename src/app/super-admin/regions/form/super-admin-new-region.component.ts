import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastService, ValidationService } from "app/services";
import { SuperAdminRegionsService } from 'app/super-admin/services'
import { SuperAdminRegionForm } from './super-admin-region-form';
import { TranslateService } from "@ngx-translate/core";
import { SuperAdminAccountImagesService } from "../super-admin-account-images.service";

@Component({
  selector: 'super-admin-new-region',
  styleUrls: ['./super-admin-region-form.scss'],
  templateUrl: './super-admin-region-form.html'
})

export class SuperAdminNewRegionComponent extends SuperAdminRegionForm {
  inputMode = 'SHARED.MODES.ADD_NEW';
  apiSubmit = (value) => this.service.create(value);

  constructor(
    public fb: FormBuilder,
    public toastService: ToastService,
    public service: SuperAdminRegionsService,
    public router: Router,
    public route: ActivatedRoute,
    protected imageApi: SuperAdminAccountImagesService,
    protected translate: TranslateService
  ) {
    super(fb, toastService, router, route, service, imageApi, translate);
    this.addFields();
  }

  private addFields() {
    let adminEmail = new FormControl('', [Validators.required, ValidationService.emailValidator]);
    this.accountForm.addControl('adminEmail', adminEmail);
  }
}
