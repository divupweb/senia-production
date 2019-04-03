import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'
import { TranslateService } from "@ngx-translate/core";
import { ToastService } from "app/services";
import {
  AdminAllergiesService,
  AdminAllergyImagesService
} from '../services'
import { AllergyForm } from "./admin-allergy-form";


@Component({
  selector: 'admin-new-allergy',
  styleUrls: [ 'allergy-form.scss' ],
  templateUrl:'./allergy-form.html'
})

export class AdminNewAllergyComponent extends AllergyForm {
  constructor(
    public formBuilder: FormBuilder,
    public toastService: ToastService,
    public service: AdminAllergiesService,
    public imageService: AdminAllergyImagesService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService) {
    super(formBuilder, toastService, service, imageService, translate);
  }

  inputMode = 'SHARED.MODES.ADD_NEW';

  submitForm() {
    this.service.create(this.allergyForm.value).subscribe(
      (response) => {
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      (error) => {
        this.toastService.error(error);
      }
    );
  }

  loadAllergy() {
    this.allergyForm.controls.names.push(this.initName());
  }
}
