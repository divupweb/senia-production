import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'
import { TranslateService } from "@ngx-translate/core";
import { PaginationInstance } from 'ngx-pagination';
import 'rxjs/add/operator/debounceTime';
import { Mixin } from "app/helpers";
import { AdminKitchensService, AdminStateService } from 'app/admin/services';
import { AppStateService, AuthService, ToastService, ObjectLoader } from 'app/services'
import { KitchenBecome } from '../shared';

@Component({
  selector: 'kitchens-list',
  providers: [ AdminKitchensService ],
  styleUrls: [ 'kitchens-list.scss' ],
  templateUrl: './kitchens-list.html'
})
@Mixin([KitchenBecome])
export class AdminKitchensListComponent {
  isFinite = isFinite; // bind js function
  queryForm: any;
  showDiscount;
  selectedKitchenId;
  kitchens = [];
  public paginationConfig: PaginationInstance = {
    id: 'categories',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 1
  };
  selectedAll = false;
  selectedCount = 0;
  popover;
  sortOrder = {
    column: 'created_at',
    order: false
  }
  sortItems = [
    { name: 'Name', column: 'name' },
    { name: 'Address', column: 'address' },
    { name: 'Created at', column: 'created_at' },
    { name: 'Orders', column: 'orders_count' },
    { name: 'Phone', column: 'phone' },
    { name: 'Status', column: 'active' }
  ];

  @ViewChild('sendMessage') sendMessage;

  constructor(public service: AdminKitchensService,
              public element: ElementRef,
              private router: Router,
              private auth: AuthService,
              private state: AppStateService,
              private toast: ToastService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              protected translate: TranslateService,
              public adminState: AdminStateService) {
    this.queryForm = this.formBuilder.group({ query: '' });
    this.queryForm.valueChanges.debounceTime(300).subscribe((data) => this.getPage(1));
  }

  ngOnInit() {
    this.getPage(1)
  }

  getPage(page: number = this.paginationConfig.currentPage) {
    let paginationParams = {page: page, per_page: this.paginationConfig.itemsPerPage};
    let queryParams = { query: encodeURIComponent(this.queryForm.get('query').value) };
    let params = _.merge(
      queryParams,
      paginationParams,
      this.sortOrder,
      { active: this.adminState.activeOnly }
    );

    this.service.getList(params)
      .subscribe(
        (response) => {
          this.paginationConfig.currentPage = page;
          this.paginationConfig.totalItems = response.total;
          this.loadKitchens(response.items);
        },
        (error) => this.toast.error(error)
      )
  }

  private loadKitchens(items) {
    this.selectedCount = 0  ;
    this.selectedAll = false;
    this.kitchens = items.map(ObjectLoader.toCamelCase);
  }

  onActiveOnlyChange(event) {
    if (this.adminState.activeOnly === event.checked) return;
    this.getPage(1);
  }

  // sort

  changeOrder(column) {
    if (this.sortOrder.column === column) {
      this.sortOrder.order = !this.sortOrder.order;
    } else {
      this.sortOrder.column = column;
      this.sortOrder.order = true;
    }

    this.getPage(1);
  }

  onSortSelect(event) {
    this.changeOrder(event.column);
  }

  // select

  public toggleAll(): void {
    this.selectedAll = !this.selectedAll;
    this.kitchens.forEach((c) => c.selected = this.selectedAll);
    this.selectedCount = this.selectedAll ? this.kitchens.length : 0;
  }

  selectKitchen(kitchen) {
    kitchen.selected = !kitchen.selected;
    this.selectedCount += kitchen.selected ? 1 : -1;
    if (this.selectedAll && !kitchen.selected) this.selectedAll = false;
  }

  get selectedKitchens() {
    return this.kitchens.filter((c) => !!c.selected);
  }

  // item popover

  openItemPopover(id) {
    setTimeout(() => { this.popover = id }, 50);
  }

  closeItemPopover(event = null) {
    this.popover = null;
  }


  // actions

  goToCreateForm() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  showEdit(id) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  showDiscountPopup(id) {
    this.showDiscount = true;
    this.selectedKitchenId = id;
  }

  changeKitchenState(kitchen, event) {
    let active = event.checked === true;
    if (kitchen.active == active) return;
    this.service.changeActive(kitchen.id, active).subscribe(
      () => {
        kitchen.active = active;
        if (this.adminState.activeOnly && !active) this.getPage();
      },
      (error) => this.toast.error(error)
    )

    this.closeItemPopover();
  }
}
