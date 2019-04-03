import { WindowRef } from "./window-ref";

export class Analytics {
  protected signUpAsCompanyEvent = 'Sign Up As Company';
  protected signUpAsEmployeeEvent = 'Sign Up As Employee';
  protected registerKitchenEvent = 'Register Kitchen 1/2';
  protected downloadIOSAppEvent = 'Download IOS app';
  protected downloadAndroidAppEvent = 'Download Android app';
  protected facebookPageEvent = 'Facebook page click';
  protected twitterPageEvent = 'Twitter page click';
  protected instagramPageEvent = 'Instagram page click';

  protected timeout;
  protected timeOutThreshold: number = 500;
  protected analytics = {
    track: function (event, data, options?, callback?) {
      _.attempt(callback);
    },
    identify: function (event, data, options?, callback?) {
      _.attempt(callback);
    }
  };

  public constructor() {
    _.merge(this.analytics, WindowRef.nativeWindow.analytics);
  }

  public track(event: string, data: any, callback: Function = new Function()): void {
    _.attempt(this.analytics.track, event, data, {}, callback)
  }

  public identify(userId: string|number, data: any): void {
    _.attempt(this.analytics.identify, userId, data)
  }

  public signUpAsEmployee(user: any): void {
    this.track(this.signUpAsEmployeeEvent, {
      'Employee-email': _.get(user, 'email'),
    });
  }

  public signUpAsCompany(data: { company: any, user: any }): void {
    const company = data.company;
    const user = data.user;
    this.track(this.signUpAsCompanyEvent, {
      'Company-name': _.get(company, 'name'),
      'Invoice-email': _.get(company, 'email'),
      'Organization-number': _.get(company, 'organization_number'),
      'Region': _.get(company, 'account_name'),
      'Zip-code': _.get(company, 'zip_code'),
      'Delivery-address': _.get(company, 'address'),
      'Floor': _.get(company, 'floor'),
      'Contact-person-first-name': _.get(user, 'first_name'),
      'Contact-person-last-name': _.get(user, 'last_name'),
      'Contact-person-mobile': _.get(user, 'phone'),
      'Contact-person-email': _.get(user, 'email'),
    });
  }

  public registerKitchen(data: any): void {
    const kitchen = _.get(data, 'kitchen') || data;
    this.track(this.registerKitchenEvent, {
      'Kitchen-name': _.get(kitchen, 'name'),
      'Phone': _.get(kitchen, 'phone'),
      'Kitchen-email': _.get(kitchen, 'email'),
      'Region': _.get(kitchen, 'account_name'),
      'Zip-code': _.get(kitchen, 'zip_code'),
      'Head-chef-name': _.get(kitchen, 'head_chef_name'),
      'Payment-details': _.get(kitchen, 'payment_details'),
    });
  }

  public downloadIOSApp($event): void {
    this.trackExternalLink(this.downloadIOSAppEvent, $event);
  }

  public downloadAndroidApp($event): void {
    this.trackExternalLink(this.downloadAndroidAppEvent, $event);
  }

  public facebookPage($event): void {
    this.trackExternalLink(this.facebookPageEvent, $event);
  }

  public instagramPage($event): void {
    this.trackExternalLink(this.instagramPageEvent, $event);
  }

  public twitterPage($event): void {
    this.trackExternalLink(this.twitterPageEvent, $event);
  }

  protected trackExternalLink(eventName, $event): void {
    const href = $event.currentTarget.href;
    const refer = () => WindowRef.nativeWindow.location.href = href;
    $event.preventDefault();
    clearTimeout(this.timeout);
    this.timeout = setTimeout(refer, this.timeOutThreshold);
    this.track(eventName, {}, () => {
      clearTimeout(this.timeout);
      refer();
    });
  }
}