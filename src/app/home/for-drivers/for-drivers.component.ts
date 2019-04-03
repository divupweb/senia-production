import { Component, ViewChild } from '@angular/core'
import { Analytics, UrlsInfo } from "app/services";

@Component({
  selector: 'for-drivers',
  styleUrls: ['../home.scss', 'for-drivers.scss'],
  templateUrl: './for-drivers.html'
})

export class HomeForDriversComponent {
  public urlsInfo: UrlsInfo = UrlsInfo;
  @ViewChild('driverRequest') driverRequest;
  public constructor(public analytics: Analytics) {}
}
