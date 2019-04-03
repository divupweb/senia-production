import { EventEmitter } from "@angular/core";

export class LoginFormRequestService {
  public requested$: EventEmitter<any> = new EventEmitter();

  public request(): void {
    this.requested$.emit();
  }
}
