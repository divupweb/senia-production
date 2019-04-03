import { HeaderService } from './header.service';
import {
  NotificationsApiService,
  NotificationsService
} from "app/user/services";


export const providers = [
  HeaderService,
  NotificationsApiService,
  NotificationsService,
]
