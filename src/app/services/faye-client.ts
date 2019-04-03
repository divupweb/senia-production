import { Injectable } from '@angular/core';
import * as faye from 'faye';
import { AppStateService } from 'app/services';

@Injectable()
export class FayeClient {
  private clientInstance: any;
  constructor(private state: AppStateService) {
    this.initClient()
  }

  get client() {
    return this.clientInstance
  }

  private initClient() {
    this.clientInstance = new faye.Client(`${this.domain}/faye`)
    // https://github.com/faye/faye/issues/178
    // this.clientInstance.disable('autodisconnect');
    this.setToken();
  }

  private get domain() {
    if ('development' === ENV) {
      return "http://localhost:9393"
    } else {
      return BASE_API_URL.split('/').slice(0, -2).join('/');
    }
  }

  private setToken() {
    let user = this.state.currentUser();
    if (!user || !user.faye_token) return;

    this.client.addExtension({
      outgoing: (message, callback) => {
        if (message['channel'] == '/meta/subscribe') {
          message.ext = message.ext || {};
          message.ext.userToken = user.faye_token;
          message.ext.userId = user.id;
        }
        callback(message);
      }
    })
  }
}
