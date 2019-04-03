import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastService } from "app/services";
import { TranslateService } from "@ngx-translate/core";
import { AdminCompaniesService } from 'app/admin/services'
import { CompanyCreditsShared } from '../company-credits-shared'

@Component({
  selector: 'company-credits',
  providers: [ AdminCompaniesService ],
  styleUrls: [ '../companies-list.scss' ],
  templateUrl: './company-credits.html'
})

export class CompanyCreditsComponent extends CompanyCreditsShared {
  creditForm;
  @Output() onChange = new EventEmitter();
  constructor(private service: AdminCompaniesService,
              private toast: ToastService,
              private formBuilder: FormBuilder,
              protected translate: TranslateService) {
                super();
              }

  load() {
    this.service.getCompanyEmployees(this.companyId).subscribe(
      (employees) => this.employees = employees,
      (error) => this.toast.error(error)
    )
  }

  submit() {
    this.service.setCredit(this.companyId, this.creditForm.value, this.employeeIds).subscribe(
      () => {
        this.emit();
        this.close();
        this.toast.success(this.translate.instant('TOAST.SUCCESS.CHANGES_SAVED'));
      },
      (error)    => this.toast.error(error)
    )
  }

  initForm() {
    this.creditForm = this.formBuilder.group({
      credit:   [this.initialCredit],
      employeeCredit: ['']
    });
  }

  formValid() {
    let companyCredit = this.creditForm.controls.credit.value;
    let employeeCredit = this.creditForm.controls.employeeCredit.value;
    return companyCredit >= 0 || (employeeCredit >= 0 && this.employeeIds.length > 0)
  }

  emit() {
    let value = this.creditForm.get('credit').value;
    // if (value) this.onChange.emit({ id: this.companyId, value: value });
    this.onChange.emit({ id: this.companyId, value: value });
  }
}
