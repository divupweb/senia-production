import { Component } from '@angular/core'
import { Analytics, UrlsInfo } from "app/services";

@Component({
  selector: 'proprietary-technology',
  styleUrls: ['../home.scss', 'proprietary-technology.scss'],
  templateUrl: './proprietary-technology.html'
})

export class HomeProprietaryTechnologyComponent {
  public urlsInfo: UrlsInfo = UrlsInfo;

  public constructor(public analytics: Analytics) {}
}
