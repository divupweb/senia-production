import { UserMenuService } from 'app/shared';

import {
  AppStateService,
  FayeClient,
  PushSubscriptions
} from "app/services";

import { AdminStateService } from './services';

let pushProvider = {
  provide: PushSubscriptions,
  useFactory: (faye: FayeClient, state: AppStateService) => {
    let rootPath = `/account/${state.currentAccount().id}`;
    return new PushSubscriptions(faye, state, rootPath)
  },
  deps: [FayeClient, AppStateService]
};

export let providers = [
    UserMenuService,
    FayeClient,
    pushProvider,
    AdminStateService
  ];
