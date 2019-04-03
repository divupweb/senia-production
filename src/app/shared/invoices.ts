import { Router, ActivatedRoute } from '@angular/router';
import { ToastService, UrlOpenable } from "app/services";
import { Mixin } from "app/helpers/decorators/mixin";
import { TranslateService } from "@ngx-translate/core";
import { GenerateInvoice } from "app/services"

@Mixin([UrlOpenable])
export class Invoices implements UrlOpenable {
  openUrl: (url: string, focus?: boolean, tab?) => void;  getTab: () => void;  openTab: () => void; closeTabs: (t?) => void;
  tab;
  selectedMonth = moment().startOf('month').subtract(1, 'months');

  constructor(public service: GenerateInvoice,
              public toast: ToastService,
              public router: Router,
              public route: ActivatedRoute,
              protected translate: TranslateService) { }

  generateInvoice() {
    let tabs = [this.getTab(), this.getTab()];
    this.service.generateInvoice(this.route.snapshot.params.id, this.selectedMonth.format('YYYY-MM-DD')).subscribe(
      (response) => {
        this.toast.success(this.translate.instant('TOAST.SUCCESS.INVOICE_GENERATED'));
        this.openInvoice(response.detailed_invoice, tabs[0]);
        this.openInvoice(response.invoice, tabs[1]);
      },
      (error) => {
        this.toast.error(error);
        this.closeTabs(tabs);
      }
    )
  }

  onMonthChange(e) {
    this.selectedMonth = e;
  }

  private openInvoice(invoice, tab) {
    let url = _.get(invoice, 'file.url');
    if (url) this.openUrl(url, false, tab);
  }
}
