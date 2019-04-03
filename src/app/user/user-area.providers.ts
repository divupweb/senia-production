import {
  RatingsApiService,
  UserSettingsApiService,
  UserStateService,
  UserAllergiesApiService
} from "./services";

import { MenuItemService } from "./menu";


import { FayeClient, PushSubscriptions, AppStateService } from 'app/services';

let pushProvider = {
  provide: PushSubscriptions,
  useFactory: (faye: FayeClient, state: AppStateService) => {
      let id = _.get(state.currentUser(), 'id')
      let rootPath = '';
      if (id) rootPath = `/${id}`;
      return new PushSubscriptions(faye, state, rootPath)
    },
  deps: [FayeClient, AppStateService]
};

export let providers = [
    FayeClient,
    RatingsApiService,
    UserStateService,
    UserSettingsApiService,
    UserAllergiesApiService,
    pushProvider,
    MenuItemService
];
