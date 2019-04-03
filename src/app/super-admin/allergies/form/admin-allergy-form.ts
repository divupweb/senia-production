import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
import {
  AdminAllergiesService,
  AdminAllergyImagesService
} from '../services'
import { ToastService } from "app/services";


export class AllergyForm {
  allergyForm: any;
  imageUrl: string;
  langs = [];

  constructor(
    public fb: FormBuilder,
    public toastService: ToastService,
    public service: AdminAllergiesService,
    public imageService: AdminAllergyImagesService,
    public translate: TranslateService) {
    this.allergyForm = fb.group({
      imageId: ['', Validators.required],
      names: fb.array([])
    });
  }

  loadAllergy() { /* */}

  ngOnInit() {
    this.loadAllergy();
    this.langs = this.translate.getLangs();
  }

  imageUploadUrl() { return this.imageService.imageUrl(); }

  fileUpload(data) {
    let control = this.allergyForm.controls['imageId'];
    if (data.errors) {
      this.toastService.error(data.errors.file);
    } else {
      this.updateImage(data.id, data.display_url);
    }
  }

  deleteImage() {
    this.imageService.delete(this.allergyForm.value['imageId']).subscribe(
      (response) => {
        this.updateImage();
      },
      (error) => this.toastService.error(error)
    )
  }

  private updateImage(id = null, url = null) {
    var control = this.allergyForm.controls['imageId'];
    control.setValue(id);
    control.markAsDirty();

    this.imageUrl = url;
  }

  addLocale() {
    this.allergyForm.controls.names.push(this.initName())
  }

  removeLocale(i) {
    this.allergyForm.controls.names.removeAt(i);
  }

  initName(name = '', locale = 'en') {
    return this.fb.group({
      name: [name, Validators.required],
      locale: [locale, Validators.required]
    })
  }
}
