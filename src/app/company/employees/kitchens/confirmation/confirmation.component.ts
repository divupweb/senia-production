import { Component, ViewChild, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';

@Component({
    selector: 'confirmation',
    templateUrl: './confirmation.html',
})

export class ConfirmationComponent {
  @ViewChild('modalConfirmation') public modal: ModalDirective;
  subjUpdate$;

  show(subscription, used) {
    this.modal.show();
    return this.buildObserver();
  }

  submit() {
    this.subjUpdate$.emit(true);
    this.modal.hide();
  }

  close() {
    this.subjUpdate$.emit(false);
    this.modal.hide();
  }

  private buildObserver() {
    this.subjUpdate$ = new EventEmitter;
    return this.subjUpdate$;
  }
}
