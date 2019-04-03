import { ObjectLoader } from 'app/services';

export class Company {

  id;
  name;
  address;
  address2;
  organizationNumber;
  active = true;
  pinCode;
  approvedAt;
  balance = 0;
  displayUrl;
  canteen = false;
  canteenApplied;
  usersCount = 0;
  ordersCount = 0;
  messages = 0;
  chargePeriod = null;
  validPayment = false;

  constructor(object) {
    this.load(object);
    this.generateMessages();
  }

  private load(object) {
    Object.assign(this, ObjectLoader.toCamelCase(object));
  }

  private generateMessages() {
    this.messages = Math.floor(Math.random() * 10) + 1
  }
}
