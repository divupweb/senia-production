import { Component, ViewChild } from '@angular/core'
import { Analytics, UrlsInfo } from "app/services";
@Component({
  selector: 'about-us',
  styleUrls: ['../home.scss', 'about-us.scss'],
  templateUrl: './about-us.html'
})

export class HomeAboutUsComponent {
  public urlsInfo: UrlsInfo = UrlsInfo;
  @ViewChild('companyReg') companyReg;
  @ViewChild('kitchenReg') kitchenReg;
  public constructor(public analytics: Analytics) {}

}
