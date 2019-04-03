import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";

import { ToastService, Forms, ObjectLoader } from "app/services";
import { AbstractPopupComponent } from "app/shared";
import { AdminCompaniesService } from 'app/admin/services';
import { SharedLocationsApiService } from './shared-locations-api.service';

@Component({
  selector: 'shared-location',
  templateUrl: './shared-location.component.html',
  styleUrls: ['./shared-location.component.scss']
})
export class SharedLocationComponent extends AbstractPopupComponent {
  @Input() newCompanies = [];
  dropSpots = [];
  companies = [];
  currentCompanies = [];
  allCompanies = [];
  form;
  search = '';

  @Output() onUpdate = new EventEmitter();

  // Initialize

  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private api: SharedLocationsApiService,
    private companiesApi: AdminCompaniesService,
    private t: TranslateService) {
    super();
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      id: null,
      name: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      address2: [''],
      floor: [''],
      zipCode: ['', Validators.required]
    });
  }

  // Open

  private init() {
    this.currentCompanies = [];
    this.form.reset();
  }

  open(companies) {
    this.companies = companies;
    this.init();
    this.initDropSpot();
    this.loadDropSpots();
    this.show();
  }

  // dropspot

  selectedDropSpotId;

  private defaultDropSpot() {
    let msg = this.t.instant('CONTROLS.NEW');
    let newDropSpot = { id: null, text: msg };
    return newDropSpot;
  }

  private loadDropSpots() {
    this.api.dropSpots().subscribe(
      (data) => {
        this.dropSpots = data;
        this.dropSpots.forEach((d) => d.text = d.name);
        this.dropSpots.unshift(this.defaultDropSpot());

        let dropSpot = _.find(this.dropSpots, { id: this.selectedDropSpotId })
        this.setDropSpot(dropSpot);
      },
      (error) => this.toast.error(error)
    )
  }

  private setDropSpot(dropSpot) {
    this.currentDropSpot = dropSpot;
    if (!this.currentDropSpot.id) {
      this.form.reset()
    } else {
      this.form.patchValue(this.currentDropSpot);
    };
    this.currentCompanies = _.get(this.currentDropSpot, 'companies', []);
    this.filterCompanies();
  }


  private initDropSpot() {
    this.currentDropSpot = this.defaultDropSpot();
    this.selectedDropSpotId = null;
    let ids = _.flow(_.uniq, _.compact)(_.map(this.companies, 'sharedLocationId'));
    if (ids.length == 1) this.selectedDropSpotId = ids[0];
  }

  private filterCompanies() {
    let ids = this.currentCompanies.map((c) => c.id)
    this.companies.forEach((c) => {
      c.hidden = ids.indexOf(c.id) > -1
    });
  }



  // Drop spot

  currentDropSpot;
  onDropStopSelected(id) {
    id = id === 'null' ? null : +id;
    let dropSpot = _.find(this.dropSpots, { id });
    this.setDropSpot(dropSpot);
  }

  onOldCompanyRemove(item) {
    _.remove(this.currentCompanies, item);
    _.remove(this.companies, item);
  }

  onCompanyRemove(item) {
    _.remove(this.companies, item);
  }

  // add company
  updateCompaniesList = (query) => {
    return this.companiesApi.search(query);
  };

  onAddCompany(company) {
    if (_.some(this.currentCompanies, (c) => c.id === company.id) ||
      _.some(this.companies, (c) => c.id === company.id)) return;
    this.companies.push(company);
  }


  // Save

  private companyIds() {
    let ids = this.currentCompanies.map((c) => c.id);
    this.companies.forEach((c) => ids.push(c.id));
    return ids;
  }

  save() {
    if (Forms.invalid(this.form)) return;
    let value = this.form.value;
    value['companyIds'] =this.companyIds();

    this.api.save(value).subscribe(
      (data) => {
        let msg = this.t.instant('TOAST.SUCCESS.SHARED_LOCATION_SAVED');;
        this.toast.info(msg);
        this.close();
        this.onUpdate.emit(data);
      },
      (error) => {
        this.toast.error(error)
      }
    )
  }

}
