import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'
import { ToastService, ObjectLoader, ValidationService, Forms } from "app/services";
import { SuperAdminRegionsService } from 'app/super-admin/services'
import { TranslateService } from "@ngx-translate/core";
import { SuperAdminAccountImagesService } from "../super-admin-account-images.service";

export class SuperAdminRegionForm {
  public accountForm: FormGroup;
  public deliveryTypes = ['Bjorn Transport', 'Food Farm'];
  public templates = ['Norway', 'Foodfarm'];
  public inputMode;
  public showAdmin: boolean = true;
  public imageUrl: string;
  protected id;
  apiSubmit;


  currencyList = [];
  timeZones = [];

  constructor(
    public fb: FormBuilder,
    public toast: ToastService,
    public router: Router,
    public route: ActivatedRoute,
    public service: SuperAdminRegionsService,
    protected imageApi: SuperAdminAccountImagesService,
    protected translate: TranslateService
  ) {
    this.initForm();
    this.loadCurrencyList()
    this.loadTimeZones();
  }

  private initForm() {
    this.accountForm = this.fb.group({
      name: ['', Validators.required],
      delivery: ['', Validators.required],
      city: '',
      country: '',
      deliveryCost: 0,
      deliveryVat: 0,
      vat: 0,
      template: 0,
      minCharge: 0,
      currency: ['', Validators.required],
      calendarId: '',
      imageId: '',
      locale: [this.translate.currentLang, Validators.required],
      timeZone: ['Europe/Oslo', Validators.required],
      showKitchenRating: false,
      image: this.fb.group({
        id: ['', Validators.required],
        displayUrl: ''
      }),
      logo: this.fb.group({
        id: ['', Validators.required],
        displayUrl: ''
      }),
      email: ['', Validators.compose([ValidationService.emailValidator, Validators.required])],
      enterprise: false,
      subsidyMaxValue: [200, Validators.required],
      settings: this.fb.group({
        landingEmployee: [true],
        landingCompany:  [true]
      })
    });
  }

  private loadCurrencyList() {
    this.service.currency().subscribe(
      (data) => {
        this.currencyList = data;
      },
      (error) => {
        this.toast.error(error);
      }
    )
  }

  private loadTimeZones() {
    this.service.timeZones().subscribe(
      (data) => this.timeZones = data,
      (error) => this.toast.error(error)
    )
  }

  protected submit(observer) {
    observer.subscribe(
      () => this.router.navigate(['..'], { relativeTo: this.route }),
      (error) => this.toast.error(error)
    );
  }

  protected formValue() {
    return ObjectLoader.toSnakeCase(this.accountForm.value);
  }


  imageUploadUrl() { return this.imageApi.imageUrl(); }
  logoUploadUrl() { return this.imageApi.imageUrl('logo'); }

  fileUpload(data, type) {
    if (data.errors) {
      this.toast.error(data.errors.file);
    } else {
      let obj = {}
      obj[type] = ObjectLoader.toCamelCase(data);
      this.updateImage(obj);
    }
  }

  deleteImage(type) {
    this.imageApi.delete(this.accountForm.get([type, 'id']).value, type).subscribe(
      (response) => this.accountForm.get(type).reset(),
      (error) => this.toast.error(error)
    )
  }

  private updateImage(imageObj: any = null) {
    this.accountForm.patchValue(imageObj);
  }

  submitForm() {
    if (Forms.invalid(this.accountForm)) return
    let value = this.formValue();
    let observer = this.apiSubmit(value);
    this.submit(observer);
  }
}
