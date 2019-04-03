import * as Rollbar from 'rollbar';
import { Injector, Injectable, ErrorHandler } from '@angular/core';
import { AppStateService, WindowRef } from 'app/services'

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(private injector: Injector, private state: AppStateService) { }
  handleError(err: any): void {
    if (/Swiper is not defined/.test(err)) return;
    if (/Loading chunk \d failed/.test(err)) {
      WindowRef.nativeWindow.location.reload()
    }
    var rollbar = this.injector.get(Rollbar);
    let user = this.state.currentUser();
    if (user) {
      rollbar.configure({
        payload: {
          person: {
            id: _.get(user, 'id'),
            email: _.get(user, 'email')
          }
        }
      });
    }
    rollbar.error(err.originalError || err);
  }
}

export let rollbarProviders = [];
if (ROLLBAR_ACCESS_TOKEN) {
  const rollbarConfig = {
    accessToken: ROLLBAR_ACCESS_TOKEN,
    verbose: true,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: process.env.STAGE,
      client: {
        javascript: {
          source_map_enabled: true,
          guess_uncaught_frames: true,
          code_version: CODE_VERSION
        }
      }
    }
  };
  rollbarProviders = [
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
    {
      provide: Rollbar,
      useFactory: () => new Rollbar(rollbarConfig)
    }
  ];
}
