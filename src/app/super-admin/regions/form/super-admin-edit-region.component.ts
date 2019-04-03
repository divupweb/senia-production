import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'
import { ToastService, ObjectLoader } from "app/services";
import { SuperAdminRegionsService } from 'app/super-admin/services'
import { SuperAdminRegionForm } from './super-admin-region-form';
import { TranslateService } from "@ngx-translate/core";
import { SuperAdminAccountImagesService } from "../super-admin-account-images.service";

@Component({
  selector: 'super-admin-edit-region',
  styleUrls: ['./super-admin-region-form.scss'],
  templateUrl: './super-admin-region-form.html'
})

export class SuperAdminEditRegionComponent extends SuperAdminRegionForm {
  inputMode = 'SHARED.MODES.EDIT';
  public showAdmin: boolean = false;
  apiSubmit = (value) => this.service.update(this.id, value);
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
    this.id = route.snapshot.params.id;
  }

  ngOnInit() {
    this.loadForm();
  }

  private loadForm() {
    this.service.getItem(this.id).subscribe(
      (response) => {
        let data = ObjectLoader.toCamelCase(response);
        this.accountForm.patchValue(data);
      }
    );
  }
}
