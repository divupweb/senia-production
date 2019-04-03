import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { ToastService } from "app/services";
import { AdminAllergiesService, AdminAllergyImagesService } from '../services'
import { AllergyForm } from "./admin-allergy-form";

@Component({
  selector: 'admin-edit-allergy',
  styleUrls: ['allergy-form.scss'],
  templateUrl: './allergy-form.html'
})

export class AdminEditAllergyComponent extends AllergyForm {
  private id;
  constructor(
    public formBuilder: FormBuilder,
    public toastService: ToastService,
    public service: AdminAllergiesService,
    public imageService: AdminAllergyImagesService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService
  ) {
    super(formBuilder, toastService, service, imageService, translate);
    this.id = route.snapshot.params.id;
  }

  inputMode = 'SHARED.MODES.EDIT';

  loadAllergy() {
    this.service.getItem(this.id).subscribe(
      (response) => {
        this.allergyForm.controls.imageId.setValue(response.image_id);
        _.each(response.name_translations, (name, locale) => {
          this.allergyForm.controls.names.push(this.initName(name, locale));
        });
        this.imageUrl = response.display_url;
      }
    )
  }

  submitForm() {
    this.service.update(this.id, this.allergyForm.value).subscribe(
      (response) => this.router.navigate(['..'], { relativeTo: this.route }),
      (error) => this.toastService.error(error)
    );
  }
}
