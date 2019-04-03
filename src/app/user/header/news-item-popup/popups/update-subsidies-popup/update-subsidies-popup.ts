import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

import { CurrencyFormatPipe } from 'app/pipes/currency';
import { Subsidy } from "app/user/models";
import { AppStateService } from "app/services";

import { NewsItemPopupComponent } from '../news-item-popup.component';


@Component({
  selector: 'update-subsidies-popup',
  styleUrls: ['update-subsidies-popup.scss'],
  providers: [CurrencyFormatPipe],
  templateUrl: './update-subsidies-popup.html'
})

export class UpdateSubsidiesPopupComponent extends NewsItemPopupComponent {
  buttonName = 'BUTTONS.DEFAULTS';
  subsidies = [];
  allSubsidies = [];

  constructor(
    protected t: TranslateService,
    private currencyFormat: CurrencyFormatPipe,
    private state: AppStateService) {
    super();
  }

  ngOnChanges(changes) {
    this.subsidies = this.item.data.items.map((s) => new Subsidy(s, this.t, this.currencyFormat));
    this.updateButton();
  }

  ngOnInit() {
    let user = this.state.currentUser();
    if (user.active_subsidies) {
      this.allSubsidies = user.active_subsidies
                                .map((s) => new Subsidy(s, this.t, this.currencyFormat))
                                .filter((s) => s.enabled());
    }
  }

  updateButton() {
    if (this.subsidies.length == 1)  this.buttonName = `SUBSCRIPTIONS.${this.subsidies[0].subsidyType.toUpperCase()}`;
  }
}
