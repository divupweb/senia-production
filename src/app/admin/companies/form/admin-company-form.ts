import {
  CompanyInfoApiService,
  ObjectLoader,
  ValidationService,
  Forms
} from 'app/services';
import { Validators } from '@angular/forms';

const ORGANIZATION_NUMBER_LENGTH = 9;

export class AdminCompanyForm {
  form;
  fb;
  showCompanyInfo = false;
  showRelatedKitchen = false;
  companyInfo;
  lastValue;
  companyInfoApi: CompanyInfoApiService;
  kitchens = [];
  toast;
  kitchensApi;
  relatedKitchen;
  showRelatedKitchens = false;
  router;
  backLink;
  route;
  _validator;
  company;

  // mixin
  submitApi: any;
  extendForm: any;
  editMode;
  adminForm;

  // Image
  image;
  imageDisplayUrl;


  protected subscribeToCompanyInfo() {
    this.form.controls.organizationNumber.valueChanges.subscribe(
      (value, v2) => {
        let parsedValue = this.parsedOrganizationNumber(value);
        if (parsedValue.length === ORGANIZATION_NUMBER_LENGTH && this.lastValue != parsedValue) {
          this.lastValue = parsedValue;
          this.companyInfoApi.get(parsedValue).subscribe(
            (data) => {
              this.companyInfo = ObjectLoader.toCamelCase(data);
              this.showCompanyInfo = true;
            },
            (error) => {
              this.removeCompanyInfo();
            }
          )
        }
      }
    )
  }

  private parsedOrganizationNumber(value = this.form.controls.organizationNumber.value) {
    return String(value).replace(/[^0-9]/g, '').slice(0, 9);
  }

  onFocus() {
    this.showCompanyInfo = !!this.companyInfo;
  }

  onBlur() {
    setTimeout(() => { this.showCompanyInfo = false }, 100); // handle click after blur
  }

  fillInCompanyInfo() {
    let params = _.omit(this.companyInfo, ['accountName']);
    this.form.patchValue(params);
    this.removeCompanyInfo();
  }

  private removeCompanyInfo() {
    this.showCompanyInfo = false;
    this.companyInfo = null;
  }

  private onInit() {
    this.loadKitchens();
  }


  // kitchens list

  private loadKitchens() {
    this.kitchensApi.getAllKitchens().subscribe(
      (kitchens) => {
        this.kitchens = kitchens.map((k) => {
          let kitchen = ObjectLoader.toCamelCase(k);
          kitchen.selected = false;
          return kitchen;
        });

        this.fillCompanyKitchens();
      },
      (error) => this.toast.error(error)
    )
  }

  private fillCompanyKitchens() {
    if (!this.kitchens) return;
    let ids = _.get(this.company, 'kitchenIds', []);
    this.kitchens.forEach((k) => k.selected = -1 < ids.indexOf(k.id));
  }

  onCompanyKitchensChange(event) {
    let [id, selected] = event;

    let control = this.form.get('kitchenIds');
    let ids = control.value || [];
    let index = ids.indexOf(id);
    let changed = false;

    if (selected && (-1 === index)) { // add
      ids.push(id);
      changed = true;
    } else if (!selected && -1 < index) { // remove
      ids.splice(index, 1);
      changed = true;
    }
    if (changed) control.setValue(ids);
  }

  // Related kitchens

  toggleRelatedKitchen(force = false) {
    if (force || !this.relatedKitchen) {
      this.openRelatedKitchens();
    } else {
      this.setRelatedKitchen();
    }
  }

  private openRelatedKitchens() {
    this.showRelatedKitchens = true;
  }

  onRelatedKitchenSelect(kitchen) {
    this.showRelatedKitchens = false;
    if (kitchen) this.setRelatedKitchen(kitchen);
  }

  private setRelatedKitchen(kitchen = null) {
    this.relatedKitchen = kitchen;
    let kitchenId = kitchen ? kitchen.id : null;

    this.form.get('relatedKitchenId').setValue(kitchenId);
    this.form.get('profitMargin').markAsTouched();
  }


  imageChange(event) {
    let files = event.target.files || event.srcElement.files;
    this.image = files[0];
    this.loadPreview();
  }

  private loadPreview() {
    let reader = new FileReader();
    reader.onload = (e: any) => this.imageDisplayUrl = e.target.result;
    reader.readAsDataURL(this.image);
  }


  // Form

  private initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      organizationNumber: ['', Validators.required],
      phone: ['', Validators.required],
      relatedKitchenId: '',
      profitMargin: [0, this._validator.profitMargin],
      bankAccount: '',
      invoiceDelay: [14, Validators.required],
      chargePeriod: [null],
      active: false,
      kitchenIds: [],
      canteen: [false],
      comment: '',
      locationAttributes: this.fb.group({
        address: ['', Validators.required],
        address2: [''],
        floor: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: ['', Validators.required]
      }),
    });
  }

  formValue() {
    let params = { companyParams: this.form.value };
    if (this.image) params.companyParams['image'] = this.image;
    if (!this.editMode) params['userParams'] = this.adminForm.value;
    _.each(params.companyParams, (v, k) => {
      if (v === null) delete params.companyParams[k]
    })

    return params
  }

  submitForm() {
    if (this.editMode) {
      if (Forms.invalid(this.form)) return;
    } else {
      Forms.markAsTouched(this.adminForm);
      if (Forms.invalid(this.form) || Forms.invalid(this.adminForm)) return;
    }

    let value = this.formValue();
    this.submitApi(value).subscribe(
      () => {
        this.router.navigate(this.backLink, { relativeTo: this.route });
      },
      (error) => this.toast.error(error)
    );
  }

  activeSaveButton() {
    let valid = false;
    if (this.editMode) {
      valid = this.form.valid;
    } else {
      valid = this.form.valid && this.adminForm.valid
    }

    return valid;
  }

  onActiveChange(event) {
    this.form.get('active').setValue(event);
  }
}
