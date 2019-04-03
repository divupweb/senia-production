import { Component } from '@angular/core';
import {AbstractControl, FormBuilder} from '@angular/forms';
import { ToastService } from "app/services";
import { TranslateService } from "@ngx-translate/core";
import { AdminCompaniesService } from 'app/admin/services'
import { CompanyCreditsShared } from '../company-credits-shared'

@Component({
  selector: 'company-discount',
  providers: [ AdminCompaniesService ],
  styleUrls: [ '../companies-list.scss' ],
  templateUrl: './company-discount.html'
})

export class CompanyDiscountComponent extends CompanyCreditsShared {
  showPicker = false;
  discountForm;
  range = [];
  rangeLength;

  constructor(private service: AdminCompaniesService,
              private toast: ToastService,
              private formBuilder: FormBuilder,
              protected translate: TranslateService) {
                super();
              }

  pickerChange(range) {
    this.showPicker = false;
    this.range = range;
    this.calcDiff();
  }

  onOpen() {
    this.range = [];
    this.showPicker = false;
    this.rangeLength = null;
  }

  load() {
    this.service.getCompanyEmployees(this.companyId).subscribe(
      (employees) => {
        this.employees = employees;
        this.service.getDiscount(this.companyId).subscribe(
          (data)  => {
            this.range = data.start_date && data.end_date ? [moment(data.start_date), moment(data.end_date)] : [];
            this.calcDiff();
            this.employeeIds = data.employee_ids;
            const percent = this.discountForm.get('percent');
            const employeePercent = this.discountForm.get('employeePercent');
            percent.setValue(data.percent);
            employeePercent.setValue(data.employee_percent);
            [percent, employeePercent].forEach((control: AbstractControl) => control.value > 0 ? control.markAsTouched() : false);
          },
          (error) => this. toast.error(error)
        )
      },
      (error) => this.toast.error(error)
    )
  }

  submit() {
    let range = _.map(this.range, (d) => d.format('YYYY-MM-DD'));
    this.service.saveDiscount(this.companyId, this.discountForm.value, range, this.employeeIds).subscribe(
      () => {
        this.close();
        this.toast.success(this.translate.instant('TOAST.SUCCESS.CHANGES_SAVED'))
      },
      (error)    => this.toast.error(error)
    )
  }

  initForm() {
    this.discountForm = this.formBuilder.group({
      percent:   [''],
      employeePercent: ['']
    });
  }

  openPicker() {
    if (!this.showPicker) {
      this.showPicker = true;
    }
  }

  formValid() {
    let percent = this.discountForm.controls.percent.value;
    let employeePercent = this.discountForm.controls.employeePercent.value;
    return this.range.length > 0 &&
           moment(this.range[0]) >= moment().startOf('day') &&
           ( percent > 0 || (employeePercent > 0 && this.employeeIds.length > 0))
  }

  public disabledDate(date): boolean {
    return moment().isAfter(date);
  }

  private calcDiff() {
    if (this.range.length > 1) {
      this.rangeLength = this.range[1].diff(this.range[0], 'days') + 1;
    }
  }
}
