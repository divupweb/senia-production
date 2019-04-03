import {
  AppStateService,
  FayeClient,
  PushSubscriptions
} from "app/services";
import { UserMenuService } from 'app/shared';
import {
  KitchenSettingsApiService,
  KitchenSettings,
  KitchenSubscriptionsApiService,
  KitchenSubscriptionsService,
  KitchenLogoChangedService,
  DishCategoriesApiService
} from "app/kitchen/services";
import { RegisterKitchenService } from 'app/shared/auth/kitchen-register';


let pushProvider = {
  provide: PushSubscriptions,
  useFactory: (faye: FayeClient, state: AppStateService) => {
    let id = _.get(state.kitchenAdmin(), 0);
    let rootPath = '';
    if (id) rootPath = `/kitchen/${id}`;
    return new PushSubscriptions(faye, state, rootPath)
  },
  deps: [FayeClient, AppStateService]
};

export let providers = [
  UserMenuService,
  DishCategoriesApiService,
  KitchenSettingsApiService,
  KitchenSettings,
  KitchenSubscriptionsApiService,
  KitchenLogoChangedService,
  KitchenSubscriptionsService,
  RegisterKitchenService,
  FayeClient,
  pushProvider,
];
