import { Component, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import {ParamsUrlParser, ToastService, WindowRef} from 'app/services'
import {KitchenDashboardApiService} from '../kitchen-dashboard-api.service'

const COMPANY_INFO = 'ABOUT';
const PRODUCTS = 'PRODUCTS'
const PACKAGING = 'PACKAGING'
@Component({
  selector: 'kitchen-details-popup',
  templateUrl: './kitchen-details-popup.html',
  styleUrls: ['./kitchen-details-popup.scss']
})

export class KitchenDetailsPopupComponent {
  showValue = false;
  @Input() subscription;
  @Input() date;
  @Input() accountId;
  @Input() isEmployee;
  @Input() cateringOrderId;
  @Input() deadlinePassed = false;
  orders;
  company;
  tabs = [];
  activeTab;
  companyInfoData;
  productsData;
  packagingData;
  window;
  @Input()
  get show() {
    return this.showValue;
  }
  set show(val) {
    this.showValue = val;
    this.showChange.emit(this.showValue);
    if(val) this.setTab(this.tabs[0])
  }
  constructor(private _service: KitchenDashboardApiService, public toastService: ToastService) {
    this.window = WindowRef.nativeWindow;
  }

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    if(changes['cateringOrderId']) {
      this.tabs = this.cateringOrderId ? [COMPANY_INFO, PRODUCTS] : [PRODUCTS, PACKAGING]
    }
  }

  @Output() showChange = new EventEmitter();

  printList() {
    if (!this.deadlinePassed) return;
    let resource = this.activeTab == PRODUCTS ? 'production_lists' : 'packaging_lists';
    let url = this._service.printUrl(this.isEmployee, this.accountId, this.subscription, this.date, resource, this.cateringOrderId);
    this.window.open(url, '_blank').focus();
  }

   setTab(tab) {
    if (tab == PRODUCTS) {
      if(!this.productsData) {
        this._service.getProductionList(this.isEmployee, this.accountId, this.date, this.subscription, this.cateringOrderId).subscribe(
          (response) => {
            this.productsData = response;
            this.activateTab(tab);
          },
          (error) => this.toastService.error(error)
        )
      } else {
        this.activateTab(tab);
      }
    } else if (tab == PACKAGING) {
      if (!this.packagingData) {
        this._service.getPackagingList(this.isEmployee, this.accountId, this.date, this.subscription).subscribe(
          (response) => {
            this.packagingData = response;
            this.activateTab(tab);
          },
          (error) => this.toastService.error(error)
        )
      } else {
        this.activateTab(tab);
      }
    } else if (tab == COMPANY_INFO) {
      if (!this.companyInfoData) {
        this._service.getCompanyInfo(this.cateringOrderId, this.isEmployee).subscribe(
          (response) => {
            this.companyInfoData = response;
            this.activateTab(tab);
          },
          (error) => this.toastService.error(error)
        )
      } else {
        this.activateTab(tab);
      }
    }
  }

   cancelPopup() {
    this.clearTabs();
    this.show = false;
  }

  private clearTabs() {
    this.packagingData = null;
    this.companyInfoData = null;
    this.productsData = null;
    this.activeTab = null;
  }

  private activateTab(tab) {
    this.activeTab = tab;
  }
}
