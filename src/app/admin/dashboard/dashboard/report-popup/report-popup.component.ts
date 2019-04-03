import {Component} from '@angular/core';
import {AbstractPopupComponent} from "app/shared";

@Component({
  selector: 'report-popup',
  styleUrls: ['report-popup.scss'],
  templateUrl: 'report-popup.html'
})

export class ReportPopupComponent extends AbstractPopupComponent {
  public info: any;

  public apply(info: any): ReportPopupComponent {
    this.info = info;
    return this;
  }
}
