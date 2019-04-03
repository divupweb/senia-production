import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { FayeClient, AppStateService } from 'app/services';

@Injectable()
export class PushSubscriptions {
  constructor(private faye: FayeClient, private state: AppStateService, private rootPath: string) { }

  get notifications() {
    let channel = `${this.rootPath}/notifications`;
    console.debug('subscribe to:', channel)
    return (...args) => {
      return this.client.subscribe(channel, ...args);
    };
  }


  private
  get client() {
    let observable = this.rootPath ? this.faye.client : new EmptyClient();
    return observable;
  }
}


class EmptyClient {
  subscribe(_channel, ...args) {
    return Observable.create((obs) => { obs.complete() }).subscribe(...args);
  }
}
