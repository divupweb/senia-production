import {
  Component,
  ViewChild,
  Input,
  SimpleChange,
  Output,
  EventEmitter
} from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import {AppStateService} from 'app/services'
import { PrivacyPolicyService } from './privacy-policy.service';
import {UserSettingsApiService} from 'app/user/services/user-settings-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'privacy-policy',
  templateUrl: './privacy-policy.html',
  styleUrls: ['privacy-policy.scss']
})

export class PrivacyPolicyComponent {
  @ViewChild('modalPP') public modal: ModalDirective;
  showAccept = false;
  constructor(private state: PrivacyPolicyService,
              private appState: AppStateService,
              private userService: UserSettingsApiService,
              private router: Router) {
    state.update.subscribe((data) => this.switchState(data));
    let user = this.appState.currentUser();
    if (user && !user.gdpr) {
      this.showAccept = true;
    }
  }

  switchState(data) {
    if (this.modal.isShown !== data) this.modal.toggle();
  }

  onHide() {
    this.state.close()
  }

  accept() {
    let data = {employee_settings_attributes: { gdpr: true }};
    this.userService.update(data).subscribe(
      (user) => this.onHide()
    )
  }
}
