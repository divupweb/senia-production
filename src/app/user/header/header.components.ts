import { OrderPopoverComponent } from './order-popover';
import {
  NewsPopoverComponent,
  NewsItemComponent
} from './news-popover';
import { components as ppComponents } from './news-item-popup';
import { SettingsPopoverComponent } from './settings-popover';
import { ProfilePopoverComponent } from './profile-popover';
import { DefaultsButtonComponent } from './defaults-button';
import { UserHeaderComponent } from './header.component';
import { SuspendPopoverComponent } from './suspend-popover';

export const components = [
  UserHeaderComponent,
  OrderPopoverComponent,
  SettingsPopoverComponent,
  SuspendPopoverComponent,
  ProfilePopoverComponent,
  DefaultsButtonComponent,
  NewsPopoverComponent,
  NewsItemComponent,
  ...ppComponents
]
export const componentsForExport = [
  UserHeaderComponent,
  DefaultsButtonComponent
]
