import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastService, AllergiesApiService } from "../../../services";

@Component({
  selector: 'allergies-select',
  styleUrls: ['allergies-select.scss'],
  templateUrl: './allergies-select.html'
})

export class AllergiesSelectComponent {
  @Input() allergyIds: Object[];
  @Input() customClass: any = {};
  @Output() onChange: EventEmitter<boolean> = new EventEmitter();

  constructor(public allergiesApi: AllergiesApiService,
              private toast: ToastService) { }

  allergies = [];

  ngOnInit() {
    this.loadAllergies();
  }

  ngOnChanges() {
    this.fillCheckboxes()
  }

  loadAllergies() {
    this.allergiesApi.get().subscribe(
      (response) => {
        this.allergies = response;
        this.fillCheckboxes();
      },
      (error) => this.toast.error(error)
    );
  }

  fillCheckboxes() {
    _.each(this.allergies, (allergy) => {
      if(_.includes(this.allergyIds, allergy.id))
        allergy.checked = true
    });
  }

  toggleAllergy(allergy) {
    const idx = this.allergyIds.indexOf(allergy.id);
    if (idx > -1) {
      this.allergyIds.splice(idx, 1);
    } else {
      this.allergyIds.push(allergy.id);
    }
    this.onChange.emit(true);
  }

  allergyExists(allergy) {
    return this.allergyIds.indexOf(allergy.id) > -1;
  }
}
