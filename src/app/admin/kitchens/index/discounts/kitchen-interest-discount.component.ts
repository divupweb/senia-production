import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from "app/services";
import { TranslateService } from "@ngx-translate/core";
import {AdminKitchensService} from "app/admin/services";
@Component({
  selector: 'kitchen-interest-discount',
  providers: [ AdminKitchensService ],
  styleUrls: [ './kitchen-interest-discount.scss' ],
  templateUrl: './kitchen-interest-discount.html'
})

export class KitchenInterestDiscountComponent {
  showValue = false;
  showPicker = false;
  discountForm;
  range = [];
  rangeLength;
  @Input() kitchenId;
  @Output() showChange = new EventEmitter();
  @Input()
  get show() {
    return this.showValue;
  }
  set show(val) {
    this.showValue = val;
    this.showChange.emit(this.showValue);
    if (this.showValue) {
      this.initForm();
      this.load();
    }
  }

  constructor(private service: AdminKitchensService,
              private toast: ToastService,
              private formBuilder: FormBuilder,
              protected translate: TranslateService) {}

  pickerChange(range) {
    this.showPicker = false;
    this.range = range;
    this.calcDiff();
  }

  load() {
    this.service.getkitchenDiscount(this.kitchenId).subscribe(
      (data)  => {
        this.range = data.start_date && data.end_date ? [moment(data.start_date), moment(data.end_date)] : [];
        this.calcDiff();
        this.discountForm.controls.percent.setValue(data.percent)
      },
      (error) => this. toast.error(error)
    )
  }

  submit() {
    let range = _.map(this.range, (d) => d.format('YYYY-MM-DD'));
    this.service.saveKitchenDiscount(this.kitchenId, this.discountForm.value.percent, range).subscribe(
      () => {
        this.close();
        this.toast.success(this.translate.instant('KITCHENS.SETTINGS.DISCOUNT_SAVED'))
      },
      (error)    => this.toast.error(error)
    )
  }

  close() {
    this.showValue = false;
    this.showChange.emit(this.showValue);
    this.range = [];
    this.rangeLength = null;
  }

  initForm() {
    this.discountForm = this.formBuilder.group({
      percent:   ['', [Validators.required]]
    });
  }

  openPicker() {
    if (!this.showPicker) {
      this.showPicker = true;
    }
  }

  private calcDiff() {
    if (this.range.length > 1) {
      this.rangeLength = this.range[1].diff(this.range[0], 'days') + 1;
    }
  }

  formValid() {
    return this.discountForm.valid && this.range.length > 0 && moment(this.range[0]) >= moment().startOf('day');
  }
}
