import { Injectable } from '@angular/core';
import { WindowRef, TimeZones, AppStorage } from "app/services";

@Injectable()
export class AppStateService {
  storage: any;

  constructor() {
    this.defineStorage();
  }

  private defineStorage() {
    if (AppStorage.localStorageAvailable()) {
      this.storage = localStorage;
    } else {
      this.storage = new AppStorage();
    }
  }

  get(prop?: any) {
    let value;
    try {
      value = this.storage.getItem(prop);
    } catch(e) {
      console.error('Unable to get storage', e);
      return;
    }
    let data;
    if (value !='undefined') {
      data = JSON.parse(value);
    }
    return data;
  }

  set(prop: string, value: any) {
    if (value != null ) {
      this.storage.setItem(prop, JSON.stringify(value));
    } else {
      this.storage.removeItem(prop)
    }
  }

  setAccount(account) {
    this.set('account', account);
    TimeZones.set(account);
  }

  // currentUser helpers
  currentUser() {
    return this.get('current');
  }

  currentCompany() {
    return this.get('company');
  }

  currentAccount(): any {
    return this.get('account');
  }

  currentCurrencyCode(): string {
    return _.get(this.currentAccount(), 'currency', '');
  }

  currencyInformation(): { alternate_symbols: string[], symbol_first: boolean } {
    return _.get(this.currentAccount(), 'currency_information', {});
  }

  currencyDecimalFormat(): string {
    const DEFAULT_SUBUNIT = 100;
    const fractPart = _.round(Math.log10(_.get(this.currencyInformation(), 'subunit_to_unit', DEFAULT_SUBUNIT)));
    return `1.${fractPart}-${fractPart}`;
  };

  superAdmin() {
    return this.hasRole('super_admin')
  }

  admin() {
    return this.hasRole('admin')
  }

  kitchenAdmin() {
    return this.hasRole('kitchens_administered')
  }

  companyAdmin() {
    return this.hasRole('company_admin')
  }

  logisticsUser() {
    return this.hasRole('logistics')
  }

  kitchenDeliveryUser() {
    return this.hasRole(['kitchen_delivery']);
  }

  kitchenEmployeeUser() {
    return this.hasRole('kitchen_employee');
  }

  kitchenLogisticsUser() {
    return this.hasRole('kitchen_logistics');
  }

  kitchenDriverUser() {
    return this.hasRole('kitchen_driver');
  }

  driverUser() {
    return this.hasRole('driver');
  }

  fakeCompanyAdmin() {
    return this.hasRoles(['admin', 'company_admin']);
  }

  fakeKitchenAdmin() {
    return this.hasRoles(['admin', 'kitchens_administered']);
  }

  signUpUser() {
    let user = this.currentUser();
    return !!user && user.logged_in === false;
  }

  public bannerLastShown() {
    return this.get('banner_last_shown');
  }

  public setLastBannerShown(date: any) {
    this.set('banner_last_shown', date);
  }

  public setLang(lang: string): void {
    this.set('lang', lang);
    WindowRef.nativeWindow.location.reload();
  }

  public getLang(): string|undefined {
    return this.get('lang');
  }

  public preferWeeklyMenu(flag: boolean): void {
    this.set('preferWeeklyMenu', flag)
  }

  public isWeeklyMenuPreferred(): boolean {
    return this.get('preferWeeklyMenu');
  }

  private hasRoles(roles) {
    let user = this.currentUser();
    return user && roles.every((role) => !!user[role]);
  }

  private hasRole(role) {
    let user = this.currentUser();
    return user && user[role];
  }
}
