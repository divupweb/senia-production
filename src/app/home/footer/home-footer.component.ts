import { Component } from '@angular/core'
import { Analytics, UrlsInfo } from "app/services";

@Component({
  selector: 'home-footer',
  styleUrls: ['home-footer.scss'],
  templateUrl: './home-footer.html'
})

export class HomeFooterComponent {
  public urlsInfo: UrlsInfo = UrlsInfo;

  public constructor(public analytics: Analytics) {}
}
