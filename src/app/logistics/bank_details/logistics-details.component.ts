import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LogisticsDetailsApiService } from './logistics-details-api.service'
import { ToastService } from "../../services";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'driver-dashboard',
  providers: [ LogisticsDetailsApiService ],
  styleUrls: [ 'logistics-details.scss' ],
  templateUrl: './logistics-details.html'
})

export class LogisticsDetailsComponent {
  detailsForm: any;
  constructor(private service: LogisticsDetailsApiService,
              private toast: ToastService,
              private formBuilder: FormBuilder,
              protected translate: TranslateService) {
                this.detailsForm = this.formBuilder.group({
                  address: ['', Validators.required],
                  email: ['', [Validators.required, Validators.email]],
                  vatNumber: ['', Validators.required],
                  bankAccount: [, Validators.required],
                  contactPerson: ['', Validators.required]
                });
              }

  ngOnInit() {
    this.loadPageData();
  }

  save() {
    this.service.save(this.detailsForm.value).subscribe(
      (data) => {
        this.fillForm(data)
        this.toast.success(this.translate.instant('ADMIN.DELETE_COMPANY_CONF'))  //'Invoice details saved'
      },
      (error) => this.toast.error(error)
    )
  }

  private loadPageData() {
    this.service.get().subscribe(
      (data) => {
        console.log('fasdfasdfasdf', data)
        this.fillForm(data)
      },
      (error) => this.toast.error(error)
    )
  }

  private fillForm(data) {
    this.detailsForm.controls.address.setValue(data.address)
    this.detailsForm.controls.email.setValue(data.email)
    this.detailsForm.controls.vatNumber.setValue(data.vat_number)
    this.detailsForm.controls.bankAccount.setValue(data.bank_account)
    this.detailsForm.controls.contactPerson.setValue(data.contact_person)
  }
}
