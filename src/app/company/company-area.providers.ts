import { UserMenuService, CanDeactivateGuard } from 'app/shared';
import { ContactApiService } from "./contact";
import { DashboardApiService } from './dashboard';

import {
  CompanyImageApiService,
  CompanyLogoChangedService,
  CompanyUpdateService
} from "./services";

import {
  AppStateService,
  FayeClient,
  PushSubscriptions,
  TimePickerConfigProvider,
} from "app/services";

let pushProvider = {
  provide: PushSubscriptions,
  useFactory: (faye: FayeClient, state: AppStateService) => {
    let id = _.get(state.currentCompany(), 'id')
    let rootPath = '';
    if (id) rootPath = `/company/${id}`;
    return new PushSubscriptions(faye, state, rootPath)
  },
  deps: [FayeClient, AppStateService]
};


export let providers = [
  UserMenuService,
  CompanyImageApiService,
  CompanyLogoChangedService,
  ContactApiService,
  CanDeactivateGuard,
  FayeClient,
  DashboardApiService,
  CompanyUpdateService,
  pushProvider,
  TimePickerConfigProvider
];
