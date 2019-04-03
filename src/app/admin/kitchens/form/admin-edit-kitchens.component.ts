import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { AdminKitchensService } from 'app/admin/services';
import { Observable } from "rxjs/Observable";
import { RegisterKitchenService } from "app/shared/auth/kitchen-register";
import { ToastService, AppStateService, ObjectLoader, AuthService, Forms } from "app/services";
import { Invoices } from "app/shared/invoices";
import { Mixin } from "app/helpers";
import { KitchenImagesApiService } from "../kitchen-images-api.service";
import { KitchenBecome } from '../shared';
import { KitchenForm } from "./kitchen-form";

const CATERING = 'CateringKitchenSubscription';
const KS_SUFFIX = 'KitchenSubscription';

@Component({
  selector: 'admin-edit-kitchen',
  providers: [ AdminKitchensService, RegisterKitchenService, KitchenImagesApiService ],
  styleUrls: [ 'kitchen-form.scss' ],
  templateUrl: './kitchens-form.html'
})
@Mixin([KitchenForm, KitchenBecome])
export class AdminEditKitchensComponent extends Invoices {
  public form: FormGroup;
  public buildForm: () => void;
  backLink = ['../..'];
  id;
  constructor(public service: AdminKitchensService,
              private _imagesApi: KitchenImagesApiService,
              public router: Router,
              public route: ActivatedRoute,
              public toastService: ToastService,
              protected translate: TranslateService,
              private auth: AuthService,
              private state: AppStateService) {
                super(service, toastService, router, route, translate);
                this.id = this.route.snapshot.params.id;
              }
  showApproveButton = false;
  public kitchen: any = {};
  imageDisplayUrl: string;
  image;
  @ViewChild('file')
  public file: ElementRef;
  availableAccounts = [];
  allSubscriptions = [];
  allTypes = ['Breakfast', 'Lunch', 'Dinner', 'Catering'].map((e) => e + KS_SUFFIX);
  currentAccount;
  loaded = false;
  readOnly = false;
  categories = [];
  showRegionsPopup = false;
  showDiscount = false;
  showInvoice = false;
  invoiceYear = moment().year();
  months = [];
  displayCurrentAccountTitle = false;
  editMode = true;

  ngOnInit() {
    this.buildForm();
    this.currentAccount = this.state.currentAccount();
    this.service.getItem(this.id).subscribe(
      (res) => {
        let kitchen = ObjectLoader.toCamelCase(res);
        this.setKitchen(kitchen);
        this.showApproveButton = !this.readOnly && !this.kitchen.approvedAt;
        this.fillSubscriptions();
        this.imageDisplayUrl = kitchen.displayUrl;
        this.loadAccountsToJoin();
        this.loaded = true
      }
    );
  }

  private defaultSubscription(param = {}) {
    let data = {
      type: null,
      active: false,
      capacity: 1,
      interestPercent: 0,
      kitchenDelivery: false,
      kitchenDishCategoriesAttributes: []
    };
    return Object.assign(data, param);
  }

  submitForm() {
    if (Forms.invalid(this.form)) return;
    let kitchenData = !this.readOnly ? this.form.value : {id: this.kitchen.id};
    this.service.update(kitchenData, this.allSubscriptions, this.image, this.kitchen.accountsKitchens).subscribe(
      () => this.router.navigate(this.backLink, { relativeTo: this.route }),
      (error) => this.toastService.error(error)
    );
  }

  deleteImage() {
    const subject = _.isNull(this.kitchen.imageId) ? Observable.from([true]) : this._imagesApi.delete(this.kitchen.imageId);
    subject.subscribe(
      () => {
        this.kitchen.imageId = null;
        this.imageDisplayUrl = null;
        this.image = null;
        this.file.nativeElement.value = null;
      },
      (error) => this.toastService.error(error)
    )
  }

  fileChange(event) {
    let files = event.target.files || event.srcElement.files;
    this.image = files[0];
    this.loadPreview();
  }

  private loadPreview() {
    let reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageDisplayUrl = e.target.result;
    };
    reader.readAsDataURL(this.image);
  }

  loadAccountsToJoin() {
    this.service.getAccounts().subscribe(
      (accounts) => {
        this.availableAccounts = accounts;
        this.fillAccountsName();
        _.each(this.availableAccounts, (acc) => {
          if (acc.id == this.currentAccount.id ||
            _.some(this.kitchen.accountsKitchens, { accountId: acc.id, active: true })
          ) acc.hidden = true;
        });
      },
      (error) => this.toastService.error(error)
    )
  }

  private initAccountKitchen(id) {
    return { accountId: id, active: true, default: false }
  }

  removeAccount(ak) {
    let acc = _.find(this.availableAccounts, {id: ak.accountId});
    acc.hidden = false;
    ak.active = false
    let id = ak.accountId;
    this.allSubscriptions.forEach((s) => { if (s.accountId == id) s.active = false; });
    this.checkDisplayCurrentAccountTitle();
  }

  subscriptionTitle(cat) {
    return _.replace(cat.type, KS_SUFFIX, '');
  }

  availableAccountsPopup() {
    return _.filter(this.availableAccounts, (a) => !a.hidden);
  }

  subscriptionsForAccount(accountKitchen) {
    let id = accountKitchen.accountId;
    let subs = _.filter(this.allSubscriptions, (s) => s.accountId == id && s.type != CATERING);
    return _.orderBy(subs, (s) => this.allTypes.indexOf(s.type))
  }

  cateringForAccount(accountKitchen) {
    return _.some(this.allSubscriptions, { accountId: accountKitchen.accountId, type: CATERING, active: true });
  }

  toggleCatering(accountId, e) {
    let params = { accountId: accountId, type: CATERING};
    let sub = _.find(this.allSubscriptions, params);
    if (!sub) {
      sub = this.defaultSubscription(params);
      this.allSubscriptions.push(sub);
    } else {
      sub.active = !sub.active;
    }
  }

  addAccount(id) {
    let account = _.find(this.availableAccounts, {id: id});
    account.hidden = true;

    let ak = _.find(this.kitchen.accountsKitchens, { accountId: id });
    if (!ak) {
      ak = this.initAccountKitchen(id);
      ak.name = account.name
      this.kitchen.accountsKitchens.push(ak);
    }
    ak.active = true;
    this.addNewAccount(id);
    this.toggleRegionsPopup();
    this.checkDisplayCurrentAccountTitle();
  }

  private fillSubscriptions() {
    let ids = [];
    _.each(this.kitchen.kitchenSubscriptions, (sub) => {
      let accountId = sub.accountId;
      let newSubscription = _.find(this.allSubscriptions, {accountId: accountId, type: sub.type});
      let attributes = ['id', 'active', 'capacity', 'interestPercent', 'kitchenDelivery', 'type', 'accountId'];
      let param = _.pick(sub, attributes);
      if (!newSubscription) {
        newSubscription = this.defaultSubscription(param)
        this.allSubscriptions.push(newSubscription);
      } else {
        Object.assign(newSubscription, param);
      };
      newSubscription.kitchenDishCategoriesAttributes = sub.kitchenDishCategories;
      if (-1 == ids.indexOf(accountId)) {
        ids.push(accountId);
        this.addNewAccount(accountId)
      };
    })
    this.kitchen.accountsKitchens.forEach((ak) => {
      if (-1 == ids.indexOf(ak.accountId)) this.addNewAccount(ak.accountId);
    })
  }

  private addNewAccount(accountId) {
    _.each(this.allTypes, (type) => {
      let param = { type: type, accountId: accountId };
      if (_.some(this.allSubscriptions, param)) return;
      let s = this.defaultSubscription(param);
      if (CATERING == type) s.active = false;
      this.allSubscriptions.push(s);
    })
  }

  private setKitchen(kitchen) {
    this.kitchen = kitchen;
    this.form.patchValue(this.kitchen);
    this.readOnly = kitchen.accountId != this.currentAccount['id'];
    this.checkDisplayCurrentAccountTitle();
    this.fillAccountsName();
  }

  private fillAccountsName() {
    if (this.availableAccounts.length == 0) return;
    this.kitchen.accountsKitchens.forEach((ak) => {
        let account = _.find(this.availableAccounts, { id: ak.accountId });
        ak.name = account ? account.name : '';
    })
  }

  checkDisplayCurrentAccountTitle() {
    this.displayCurrentAccountTitle = _.some(this.kitchen.accountsKitchens, (ak) => ak.active && ak.account_id != this.currentAccount.id);
  }

  setCategories(categories) {
    this.categories = categories;
  }

  toggleRegionsPopup(status = !this.showRegionsPopup) {
    let timeout = status ? 50 : 0;
    setTimeout(() => this.showRegionsPopup = status, timeout);
  }

  toggleDiscountPopup() {
    this.showDiscount = !this.showDiscount;
  }

  toggleInvoicePopup() {
    this.showInvoice = !this.showInvoice;
    if (this.months.length == 0) this.initMonths();
  }

  private initMonths() {
    const start = moment().year(this.invoiceYear).startOf('year');
    for (let i = 0; i < 12; i++) {
      this.months.push(start.clone().add(i, 'months'));
    }
  }

  disabledMonth(month) {
    return month > moment()
  }

  changeYear(val) {
    this.invoiceYear = this.invoiceYear + val;
    this.months = [];
    this.initMonths();
  }

  loadInvoice(month) {
    if (month < moment() ) {
      this.selectedMonth = month;
      this.generateInvoice();
      this.toggleInvoicePopup();
    }
  }

  closeRegionsPopup(event) {
    this.showRegionsPopup = false;
  }
}
