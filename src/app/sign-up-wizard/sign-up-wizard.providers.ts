import { FayeClient } from 'app/services';
import { UserSettingsApiService, UserStateService } from 'app/user/services';
import { SignUpWizardApiService, Settings }  from './services';

export let providers = [
  UserStateService,
  UserSettingsApiService,
  SignUpWizardApiService,
  Settings,
  FayeClient
]
