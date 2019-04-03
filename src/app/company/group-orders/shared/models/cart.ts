import { Subject } from 'rxjs/Subject';
import { CartItem } from './cart-item';
export class Cart {
  total;
  subscription;
  weekday;
  orders = [];
  information = this.defInformation();

  activeButton = false;
  showButton = false;
  buttonText;
  newCart = true;

  private timeFormat = 'HH:mm';

  private changeSubject = new Subject();
  onChange = this.changeSubject.asObservable();

  private removeSubject = new Subject();
  onRemove = this.removeSubject.asObservable();

  constructor(
    private object,
    public isCatering = false,
    private date,
    private company = null) {
    this.load()
  }

  private defInformation() {
    return {
      address: this.company.full_address,
      comment: '',
      start_time: new Date(2000,1,1,9),
      end_time: new Date(2000,1,1,21)
    }
  }

  private setButtonText() {
    this.buttonText = this.newCart ? "COMPANY.ORDERS.BUTTONS.ORDER_CATERING" : "COMPANY.ORDERS.BUTTONS.EDIT_ORDER"
  }

  private load() {
    let objCopy = Object.assign({}, this.object);
    let orders = objCopy.orders;
    let information = objCopy.information;
    delete objCopy.orders;
    delete objCopy.information;
    Object.assign(this, objCopy);
    this.loadOrders(orders);
    this.loadInformation(information);

    this.checkButton();
    this.setButtonText();
  }

  private loadOrders(orders) {
    this.orders = _.map(orders, (o) => this.initCartItem(o));
  }

  private loadInformation(information) {
    if (!information) information = {};

    let toDate = (str) => moment.utc(str, this.timeFormat).toDate();
    _.each(['start_time', 'end_time'], (k) => {
      if (information[k]) information[k] = toDate.call(this, information[k]);
    });
    this.information = Object.assign(this.defInformation(), information);
  }

  private checkButton() {
    this.newCart = !this.anyOrder();
    this.showButton = this.isCatering;
  }

  private anyOrder() {
    return this.orders.length > 0;
  }


  addItem(item) {
    let order = _.find(this.orders, { id: item.id });
    if (order) return;
    let newOrder = this.initCartItem(item, true);
    this.orders.push(newOrder);
    this.changeButtonStatus()
    return newOrder;
  }

  private initCartItem(o, changed = false) {
    let item = new CartItem(o, changed);
    item.onChange.subscribe(this.onCartItemChange.bind(this));
    item.onRemove.subscribe(this.onCartItemRemove.bind(this));
    return item;
  }

  private onCartItemChange(item) {
    this.changeButtonStatus()
    this.changeSubject.next(item);
  }

  private onCartItemRemove(item) {
    this.removeOrder(item);
    this.checkButtonStatus();
    this.removeSubject.next(item);
  }

  onInformationChange(event) {
    this.checkButtonStatus();
  }

  private removeOrder(item) {
    let index = this.orders.indexOf(item);
    if (index > -1) this.orders.splice(index, 1);
  }

  private changeButtonStatus(active = true) {
    this.activeButton = active;
  }

  private checkButtonStatus() {
    this.changeButtonStatus(this.validOrder());
  }

  private validOrder() {
    return this.anyOrder() || !this.newCart;
  }

  toParams() {
    let params = {
      date: this.date,
      order_dishes: this.ordersToParams()
    };
    let fields = ['address', 'comment'];
    let information = _.pick(this.information, fields);
    let toTime = (dt) => moment(dt).format(this.timeFormat);
    ['start_time', 'end_time'].forEach((k) => {
      information[k] = toTime.call(this, this.information[k])
    }, this);
    Object.assign(params, information);
    return params;
  }

  private ordersToParams() {
    return _(this.orders).map((o) => o.toParams())
                         .filter((o) => !!o && o.quantity > 0)
                         .value();
  }

  canBeSubmitted() {
    let resp = {
      status: false,
      msg: 'You should add at least one item to the order'
    }

    if (this.validOrder()) resp.status = true;
    return resp;
  }
}
