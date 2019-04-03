import { AppState } from './app.service'; // del
import { APP_RESOLVER_PROVIDERS } from './app.resolver'; // del
import {
  AppStateService,
  ApiClientService,
  AuthService,
  ToastService,
  AppUrlsService,
  Analytics
 } from './services';
import { UserSettingsApiService, UserStateService } from "app/user/services";
import { SpinnerService } from './helpers/spinner';

export const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  AppStateService,
  AppUrlsService,
  ApiClientService,
  AuthService,
  ToastService,
  UserStateService,
  UserSettingsApiService,
  Analytics,
  SpinnerService
];
