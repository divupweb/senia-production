import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'
import { SharedLocationsApiService } from '../shared-locations-api.service'
import { ToastService, ObjectLoader } from "../../../services";

@Component({
  selector: 'shared-location',
  styleUrls: [ 'form-shared-locations.scss' ],
  templateUrl: './form-shared-locations.html'
})

export class FormSharedLocationsComponent {
  location
  locationId
  locationForm
  companies
  inputMode
  backLink = ['..']
  formCompanies = []
  constructor(private api: SharedLocationsApiService,
              private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private toastService: ToastService) {
    this.locationId = route.snapshot.params['id'];
    if (this.locationId) {
      this.inputMode = 'SHARED.MODES.EDIT';
      this.backLink = ['../..'];
    } else {
      this.inputMode = 'SHARED.MODES.ADD_NEW';
      this.backLink = ['..'];
    }
  }

  ngOnInit() {
    this.initForm()
    this.api.getCompanies().subscribe(
      (response) => {
        this.companies = response
        this.setFormCompanies(this.companies, false)
        if (this.locationId) {
          this.loadLocation();
        }
      },
      (error) => this.toastService.error(error)
    )
  }

  private setFormCompanies(companies, active) {
    let control = this.locationForm.controls.companies;
    _.each(companies, (company) => {
      if (active) {
        control.insert(0, this.companyFormGroup(company, active))
        this.formCompanies.unshift(company)
      } else {
        control.push(this.companyFormGroup(company, active))
        this.formCompanies.push(company)
      }
    })
  }

  private companyFormGroup(company, active) {
    return this.formBuilder.group({
      id: [company.id],
      active: [!!active],
      name: [company.name]
    })
  }

  submit() {
    if(this.locationForm.valid) {
      let data = this.locationForm.value
      data.companyIds = _.map(_.filter(data.companies, {active: true }), 'id')
      delete data.companies

      let request = this.locationId ? this.api.update(this.locationId, data) : this.api.create(data)
      request.subscribe(
        (response) => this.goToIndex(),
        (error) => this.toastService.error(error)
      )
    }
  }

  goToIndex() {
    this.router.navigate(this.backLink, { relativeTo: this.route });
  }

  private loadLocation() {
    return this.api.getItem(this.locationId).subscribe(
      (response) => {
        let data = _.omit(ObjectLoader.toCamelCase(response), ['id', 'companies', 'fullAddress'])
        this.setFormCompanies(response.companies, true)
        this.locationForm.patchValue(data);
      }
    );
  }

  private initForm() {
    this.locationForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      zipCode: ['', Validators.required],
      address: ['', Validators.required],
      address2: [''],
      floor: [''],
      city: ['', Validators.required],
      country: ['', Validators.required],
      companies: this.formBuilder.array([])
    });
  }
}
