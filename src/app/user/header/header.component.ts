import { Component, OnDestroy, ViewChild } from '@angular/core'
import { Subscription }   from 'rxjs/Subscription';
import { HeaderService } from './header.service';
import { AppStateService } from "app/services";
import { NotificationsService } from 'app/user/services';

@Component({
  selector: 'user-header',
  styleUrls: ['header.scss'],
  templateUrl:'./header.html'
})

export class UserHeaderComponent implements OnDestroy {
  public header: any = { title: 'FoodFarm', info: null, backButton: null };
  public basket: any = { subsidy: null, quantity: null };
  public defaultsBanner: boolean = false;
  public suspendBanner: boolean = false;

  public suspendPopover: boolean = false;
  public profilePopover: boolean = false;

  protected subscription: Subscription;

  protected twentyDays = 20;

  @ViewChild('newsItemPopover') newsItemPopover;
  @ViewChild('newsPopover') newsPopover;
  @ViewChild('settingsPopover') settingsPopover;

  constructor(
    private headerService: HeaderService,
    private state: AppStateService,
    private notifications: NotificationsService) {

    const lastShown = this.state.bannerLastShown();
    const now = moment();
    if (!lastShown || moment.duration(now.diff(lastShown)).days() > this.twentyDays) {
      this.defaultsBanner = true;
      this.state.setLastBannerShown(now);
    }

    this.subscription = headerService.titleUpdate$.subscribe(
      (titleInfo) => {
        this.header.title = titleInfo['title'] || 'FoodFarm';
        this.header.info = titleInfo['info'];
        this.header.backButton = titleInfo['backButton'];
      }
    );

    this.subscription = headerService.basketUpdate$.subscribe(
      (basketInfo) => this.basket = basketInfo
    );

    this.headerService.unlockRequest$.subscribe(() => {
      setTimeout(() => this.suspendPopover = true, 60);
    })
  }

  public toggleBanner(): void {
    this.defaultsBanner = false;
    this.suspendBanner = this.suspendBanner ? false : !this.defaultsBanner;

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onPopupOpen(event) {
    this.newsItemPopover.open(event);
  }

  onPopupClose(event) {
    let popup = this.newsPopover.el.nativeElement.firstElementChild;
    if (popup && popup.focus) popup.focus();
  }
}
