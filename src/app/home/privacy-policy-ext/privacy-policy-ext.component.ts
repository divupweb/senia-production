import {Component, Renderer2} from '@angular/core';
import {AppStateService, WindowRef} from 'app/services'
import {UserSettingsApiService} from 'app/user/services/user-settings-api.service';

@Component({
  selector: 'privacy-policy-ext',
  templateUrl: './privacy-policy-ext.html',
  styleUrls: ['privacy-policy-ext.scss']
})

export class PrivacyPolicyExtComponent {
  public showGdpr = false;
  public window;
  constructor(private state: AppStateService,
              private service: UserSettingsApiService,
              private renderer: Renderer2) {
    this.window = WindowRef.nativeWindow;
    let user = this.state.currentUser();
    if (user && !user.gdpr) {
      this.showGdpr = true;
    }
  }

  ngAfterViewInit() {
    if (this.renderer) {
      this.renderer.setStyle(document.querySelector('home-header'), 'background-color', '#fff');
    }
  }

  accept() {
    let data = {employee_settings_attributes: { gdpr: true }};
    this.service.update(data).subscribe(
      (user) => this.window.close()
    )
  }
}
