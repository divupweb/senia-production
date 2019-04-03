import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { AdminCompaniesService, AdminStateService } from 'app/admin/services';
import { ToastService, AuthService, AppStateService } from "app/services";
import { Mixin } from "app/helpers/decorators/mixin";
import { PaginationInstance } from 'ngx-pagination';
import { CompanyAuthService } from "app/shared/auth/company-register";
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { CompanyDiscountComponent } from './discounts';
import { CompanyCreditsComponent } from './credits';
import { Company } from 'app/admin/models';
import { CompanyBecome } from '../shared';


@Component({
  selector: 'companies-list',
  providers: [ AdminCompaniesService, CompanyAuthService ],
  styleUrls: [ '../shared/companies-list.scss' ],
  templateUrl: './companies-list.html'
})
@Mixin([CompanyBecome])
export class AdminCompaniesListComponent {
  constructor(public service: AdminCompaniesService,
              public element: ElementRef,
              private router: Router,
              private auth: AuthService,
              private state: AppStateService,
              private toast: ToastService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              protected translate: TranslateService,
              private adminState: AdminStateService) {
    this.queryForm = this.formBuilder.group({ query: '' });
    this.queryForm.valueChanges.debounceTime(300).subscribe((data) => this.getPage(1) );
  }

  public companies = [];
  public paginationConfig: PaginationInstance = {
    id: 'companies',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 1
  };
  public companySelected: boolean[] = [];
  public selectedAll: boolean = false;
  queryForm: any;
  popover;
  selectedCompanyId;
  becomeCompany;
  selectedCount = 0;
  sortItems = [
    { name: 'Name', column: 'name' },
    { name: 'Address', column: 'address' },
    { name: 'Created at', column: 'created_at' },
    { name: 'Floor', column: 'floor' },
    { name: 'Users', column: 'users_count' },
    { name: 'Orders', column: 'orders_count' }
  ];
  isFinite = isFinite; // bind js function


  @ViewChild('sendMessage') sendMessage;
  @ViewChild('companyDiscount') companyDiscount;
  @ViewChild('companyCredits') companyCredits;
  @ViewChild('generateInvoice') generateInvoice;
  @ViewChild('becomeEmployee') becomeEmployee;
  @ViewChild('sharedLocation') sharedLocation;

  sortOrder = {
    column: 'created_at',
    order: false
  }

  ngOnInit() {
    this.getPage(1);
  }

  getPage(page: number = this.paginationConfig.currentPage) {
    let queryParams = { query: encodeURIComponent(this.queryForm.controls['query'].value) };
    let paginationParams = { page: page, per_page: this.paginationConfig.itemsPerPage };
    this.service.getList(_.merge(queryParams, paginationParams, this.sortOrder, { active: this.adminState.activeOnly }))
      .subscribe(
        (response) => {
          this.paginationConfig.currentPage = page;
          this.paginationConfig.totalItems = response.total;
          this.loadCompanies(response.items);
        },
        (error) => {
          this.toast.error(error);
        }
      )
  }

  private loadCompanies(items) {
    this.selectedCount = 0  ;
    this.selectedAll = false;
    this.companies = items.map((e) => new Company(e));
  }

  showEdit(id) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  goToCreateForm() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  become(id) {
    this.becomeCompany(id);
    this.closeCompanyPopover();
  }

  showDiscountPopup(id) {
    this.companyDiscount.open(id)
    this.closeCompanyPopover();
  }

  showCreditsPopup(id, companyBalance) {
    this.companyCredits.open(id, companyBalance);
    this.closeCompanyPopover();
  }

  openCompanyPopover(id) {
    setTimeout(() => { this.popover = id }, 50);
  }

  closeCompanyPopover(event = null) {
    this.popover = null;
  }

  handleCreditsChange(event) {
    this.companies.some((c) => {
      if (c.id == event.id) {
        c.balance = event.value;
        return true
      }
    })
  }

  // select companies

  public toggleAll(): void {
    this.selectedAll = !this.selectedAll;
    this.companies.forEach((c) => c.selected = this.selectedAll);
    this.selectedCount = this.selectedAll ? this.companies.length : 0;
  }

  selectCompany(company) {
    company.selected = !company.selected;
    this.selectedCount += company.selected ? 1 : -1;
    if (this.selectedAll && !company.selected) this.selectedAll = false;
  }

  get selectedCompanies() {
    return this.companies.filter((c) => !!c.selected);
  }

  ///////////////////////

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

  onActiveOnlyChange(event) {
    if (this.adminState.activeOnly === event.checked) return;
    this.getPage(1);
  }

  changeCompanyState(company, event) {
    let active = event.checked === true;
    if (company.active == active) return;
    this.service.changeActive(company.id, active).subscribe(
      () => {
        company.active = active;
        if (this.adminState.activeOnly && !active) this.getPage();
      },
      (error) => this.toast.error(error)
    )

    this.closeCompanyPopover();
  }

  // bunch popover


  private showBunchPopover = false;

  openBunchPopover() {
    if (this.selectedCount > 0 ) setTimeout(() => this.showBunchPopover = true, 50);
  }

  closeBunchPopover() {
    this.showBunchPopover = false;
  }

  onSharedLocationUpdate() {
    this.getPage()
  }
}
