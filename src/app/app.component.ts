/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Renderer2,
  ViewChild
} from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { Analytics, AppStateService, TimeZones, WindowRef } from "app/services";
import { UserStateService } from "app/user/services";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { PrivacyPolicyComponent, PrivacyPolicyService } from 'app/shared/components/privacy-policy';
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  providers: [ UserStateService, PrivacyPolicyService ],
  styleUrls: ['app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  @ViewChild('cookieLaw') cookieLawEl;
  protected defaultLang: string = 'nb';
  protected appLangs: string[] = [this.defaultLang, 'en'];

  constructor(private router: Router,
              private userState: UserStateService,
              analytics: Analytics,
              protected translate: TranslateService,
              protected state: AppStateService,
              public policy: PrivacyPolicyService,
              public renderer: Renderer2) {
    this.initTranslation()
    router.events.distinctUntilChanged((previous: any, current: any) => {
      if(current instanceof NavigationEnd) {
        this.setMargins();
        return previous.url === current.url;
      }
      return true;
    }).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        WindowRef.nativeWindow.fbq('track', 'PageView');
      }
      const user = this.userState.getUser();
      if (user) {
        analytics.identify(user.id, {
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          created: user.created_at
        })
      }
    });
  }

  lawSeen(event) {
    const barElement = this.getBar();
    if (this.renderer && barElement) {
      this.renderer.setStyle(barElement, 'margin-top', '0');
    }
  }

  private getBar() {
    return document.querySelector('home-header, user-header, header, .navbar')
  }

  private initTranslation() {
    this.translate.setDefaultLang(this.defaultLang);
    this.translate.addLangs(this.appLangs);
    this.translate.use(this.state.getLang() || this.translate.getDefaultLang());
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => moment.locale(event.lang));
  }

  ngOnInit() {
    this.initMoment();
  }

  ngAfterContentChecked() {
    if (this.cookieLawEl.cookieLawComponent) {
      this.cookieLawEl.cookieLawComponent.closeSvg = "<button>"+ this.translate.instant("BUTTONS.ACCEPT") +"</button>";
    }
  }

  private setMargins() {
    const barElement = this.getBar();
    if (!this.cookieLawEl.cookieLawSeen && this.renderer && barElement) {
      this.renderer.setStyle(barElement, 'margin-top', '85px')
    }
  }

  private initMoment() {
    const localeData = moment.localeData('nb');
    const updates = {};
    _.each(['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'], (fnName: string) => {
        const oldSubject = _.invoke(localeData, fnName);
        updates[fnName] = _.map(oldSubject, _.startCase)
      }
    );
    moment.updateLocale('nb', updates);
    let account = this.state.currentAccount();
    TimeZones.set(account);
  }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
