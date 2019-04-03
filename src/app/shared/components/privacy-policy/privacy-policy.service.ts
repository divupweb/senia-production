import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class PrivacyPolicyService {
  private state;
  private status = new Subject();
  update;

  constructor() {
    this.update = this.status.asObservable();
    this.sendStatus(false);
  }

  open() {
    this.sendStatus(true);
  }

  close() {
    this.sendStatus(false);
  }

  private sendStatus(value) {
    if (value !== this.state) {
      this.state = value;
      this.status.next(this.state);
    }
  }
}
