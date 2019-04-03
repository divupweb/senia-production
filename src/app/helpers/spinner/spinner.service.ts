import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class SpinnerService {
  private disabled = false;
  private status = new Subject<any>();
  status$ = this.status.asObservable();

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }

  show() {
    if (!this.disabled) this.status.next(true);
  }

  hide() {
    this.status.next(false);
  }
}
