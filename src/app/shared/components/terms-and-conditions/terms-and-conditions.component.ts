import {
  Component,
  ViewChild,
  Input,
  SimpleChange,
  Output,
  EventEmitter
} from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { Router } from '@angular/router';
import {UserSettingsApiService} from 'app/user/services/user-settings-api.service';

@Component({
  selector: 'terms-and-conditions',
  templateUrl: './terms-and-conditions.html',
  styleUrls: ['terms-and-conditions.scss']
})

export class TermsAndConditionsComponent {
  @ViewChild('modalToc') public modal: ModalDirective;
  constructor(private state: TermsAndConditionsService,
              private router: Router,
              private userService: UserSettingsApiService,) {
    state.update.subscribe((data) => this.switchState(data));
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
