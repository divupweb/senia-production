import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { AbstractPopupComponent } from "app/shared";
import { ToastService } from "app/services";

@Component({
  selector: 'generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.scss']
})
export class GenerateInvoiceComponent extends AbstractPopupComponent {
  service;
  id;

  year;
  selectedMonth;
  months = [];

  stage = 0;
  invoices = [];

  error;

  constructor(public toast: ToastService, private translate: TranslateService) { super() }

  open(service, id) {
    this.service = service;
    this.id = id;
    this.init()
    this.show();
  }

  private init() {
    this.year = moment().year();
    this.selectedMonth = moment().startOf('month').subtract(1, 'months');
    this.invoices = [];
    this.stage = 0;
    this.initMonths();
  }

  changeYear(val) {
    this.year = this.year + val;
    this.initMonths();
  }

  private initMonths() {
    this.months = [];
    let currentMonth = moment();
    let disabled = (d) => d > currentMonth;
    for (let i = 1; i <= 12; i++) {
      let day = moment().year(this.year).month(i).startOf('month');
      this.months.push({ day: day, disabled: disabled(day) });
    }
  }

  loadInvoice(month) {
    if (month.disabled) return;
    this.generateInvoice(month.day);
  }

  private generateInvoice(date) {
    this.invoices = [];
    this.stage = 1;
    this.error = null;
    this.service.generateInvoice(this.id, date.format('YYYY-MM-DD')).subscribe(
      (response) => {
        this.error = null;
        this.toast.success(this.translate.instant('TOAST.SUCCESS.INVOICE_GENERATED'));
        this.stage = 2;
        if (_.isArray(response.invoice)) {
          response.invoice.forEach((inv) => {
            this.addInvoice(inv, 'INVOICE');
          } )
        } else {
          this.addInvoice(response.invoice, 'INVOICE');
        }
        if (_.isArray(response.detailed_invoice)) {
          response.detailed_invoice.forEach((inv) => {
            this.addInvoice(inv, 'DETAILED');
          } )
        } else {
          this.addInvoice(response.detailed_invoice, 'DETAILED');
        }
      },
      (error) => {
        this.stage = 0;
        this.toast.error(error);
        this.error = this.toast.message(error);
      }
    )
  }

  private addInvoice(invoice, name) {
    if (!invoice) return;
    let url = _.get(invoice, 'file.url');
    if (!url) return;
    let params = { url: url, name: 'ADMIN.INVOICES.' + name, date: invoice.period };
    this.invoices.push(params);
  }
}
