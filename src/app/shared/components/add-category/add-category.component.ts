import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from "app/services";

const DEFAULT_IMAGE_URL = '/assets/images/kitchen/upload_category.png';

@Component({
  selector: 'add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {
  private image;
  showPopup = false;
  form;
  previewUrl = DEFAULT_IMAGE_URL;
  apiMethod;
  default = {
    name: '',
    min_price: 0,
    max_price: 200,
    description: '',
    bunch: false,
    _image: ''
  }

  @Input() buttonTitle = 'KITCHENS.BUTTONS.SEND_REQUEST';
  @Input() showBunch = false;
  @Output() onCategorySave = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private toast: ToastService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      min_price: [0, Validators.required],
      max_price: [200, Validators.required],
      description: ['', Validators.required],
      bunch: [false],
      _image: ['', Validators.required]
    });
  }

  close(event = null) {
    this.showPopup = false;
  }

  open(apiMethod, category = null) {
    this.apiMethod = apiMethod;
    this.reset();
    if (category) this.loadCategory(category);
    setTimeout(() => { this.showPopup = true }, 50);
  }

  onSubmit() {
    if (this.form.invalid) {
      _.each(this.form.controls, (c) => c.markAsTouched());
      return;
    };
    let params = new FormData();
    if (this.image) params.append('image', this.image);
    _.each(this.form.value, (v, k) => params.append(k, v));
    this.apiMethod(params).subscribe(
      (response) => {
        this.close();
        this.onCategorySave.emit(response);
      },
      (error) => this.toast.error(error)
    )
  }

  fileChange(event) {
    let files = event.target.files || event.srcElement.files;
    this.image = files[0];
    this.form.patchValue({ _image: '+' });
    this.loadPreview();
  }

  private loadPreview() {
    let reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    }
    reader.readAsDataURL(this.image);
  }

  private reset() {
    this.form.reset(this.default);
    this.previewUrl = DEFAULT_IMAGE_URL;
    this.image = null;
  }

  private loadCategory(category) {
    this.form.patchValue(category);
    this.form.patchValue({ _image: '+' });
    this.previewUrl = category.display_url;
  }

  checkImage() {
    this.form.get('_image').markAsTouched();
  }
}
