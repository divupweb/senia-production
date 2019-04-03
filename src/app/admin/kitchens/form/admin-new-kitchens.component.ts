import { Component, ElementRef, ViewChild } from '@angular/core';
import { AdminKitchensService } from 'app/admin/services'
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService, AppStateService } from "app/services";
import { KitchenImagesApiService } from "../kitchen-images-api.service";
import { TranslateService } from "@ngx-translate/core";
import { Mixin } from "app/helpers";
import { KitchenForm } from "./kitchen-form";
import { AbstractControl, FormGroup } from "@angular/forms";
import { RegisterKitchenService } from "app/shared/auth/kitchen-register";

@Component({
  selector: 'admin-new-kitchen',
  providers: [ AdminKitchensService, RegisterKitchenService, KitchenImagesApiService ],
  styleUrls: [ 'kitchen-form.scss' ],
  templateUrl: './kitchens-create.html'
})
@Mixin([KitchenForm])
export class AdminNewKitchensComponent implements KitchenForm {
  public form: FormGroup;
  public buildForm: () => void;

  @ViewChild('file')
  public file: ElementRef;

  constructor(private service: AdminKitchensService,
              private router: Router,
              private route: ActivatedRoute,
              private toastService: ToastService,
              protected translate: TranslateService,
              private state: AppStateService) { }
  public kitchen = {accountIds: []};
  imageDisplayUrl: string;
  backLink = ['..'];
  currentAccount;
  image;
  editMode  = false;

  ngOnInit() {
    this.buildForm();
    this.currentAccount = this.state.currentAccount();
  }

  submitForm() {
    _.each(this.form.controls, (i: AbstractControl) => i.markAsTouched());
    if (!this.form.valid) {
      return;
    }
    this.service.create(this.form.value, this.image).subscribe(
      () => {
        this.router.navigate(this.backLink, { relativeTo: this.route });
      },
      (error) => {
        this.toastService.error(error);
      }
    );
  }

  imageUploadUrl() { return this.service.imageUrl(null) }

  deleteImage() {
    this.image = this.imageDisplayUrl = this.file.nativeElement.value = null;
  }

  fileChange(event) {
    let files = event.target.files || event.srcElement.files;
    this.image = files[0];
    this.loadPreview();
  }

  private loadPreview() {
    let reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageDisplayUrl = e.target.result;
    };
    reader.readAsDataURL(this.image);
  }
}
