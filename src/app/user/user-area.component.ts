import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AppStateService,
  AuthService,
  ToastService
} from 'app/services';
import { UserSettingsApiService } from "./services";
import { PrivacyPolicyComponent, PrivacyPolicyService } from 'app/shared/components/privacy-policy';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'user-area',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['user-area.scss'],
  providers: [ PrivacyPolicyService ],
  templateUrl: './user-area.html'
})

export class UserAreaComponent {
  constructor(
    private state: AppStateService,
    private auth: AuthService,
    private toast: ToastService,
    private userSettings: UserSettingsApiService,
    private router: Router,
    private pp: PrivacyPolicyService,
    protected translate: TranslateService,) {
  }

  @ViewChild('cookieLaw') cookieLawEl;
  showGdpr = false;

  ngOnInit() {
    this.auth.currentUser(0);
    if (!this.checkUser()) return;
    this.checkActive();
    if (!this.state.currentUser().gdpr) {
      this.showGdpr = true;
    }
  }

  ngAfterContentChecked() {
    if (this.cookieLawEl && this.cookieLawEl.cookieLawComponent) {
      this.cookieLawEl.cookieLawComponent.closeSvg = "<button>"+ this.translate.instant("BUTTONS.ACCEPT") +"</button>";
    }
  }

  gdprSeen(event) {
    let data = {employee_settings_attributes: { gdpr: true }};
    this.userSettings.update(data).subscribe(
      (user) => this.showGdpr = false
    )
  }

  private checkUser() {
    if (!this.state.currentUser()) {
      this.router.navigate(['/']);
      return false;
    } else {
      if (this.state.isWeeklyMenuPreferred()) {
        this.router.navigate(['/user/weekly-menu']);
      } else {
        this.router.navigate(['/user/menu']);
      }
    }
    return true;
  }

  openPP() {
    this.cookieLawEl.cookieLawComponent.currentStyles['display'] = 'none';
    this.pp.open();
  }

  private checkActive() {
    this.userSettings.get().subscribe(
      () => {
        let user = this.state.currentUser();
        if (!user.active) this.toast.warning("User inactive");
        if (!user.valid_payment) this.toast.warning("User doesn't have any credit card");
      },
      () => {
        this.toast.error("Unable to get user info");
      }
    )
  }
}
