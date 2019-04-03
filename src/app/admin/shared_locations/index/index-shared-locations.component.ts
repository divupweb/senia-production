import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { SharedLocationsApiService } from '../shared-locations-api.service'
import { ToastService } from "../../../services";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'shared-location',
  styleUrls: [ 'index-shared-locations.scss' ],
  templateUrl: './index-shared-locations.html'
})

export class IndexSharedLocationsComponent {
  locations
  constructor(private api: SharedLocationsApiService,
              private router: Router,
              private route: ActivatedRoute,
              private toastService: ToastService,
              protected translate: TranslateService
  ) {
    this.getItems();
  }

  getItems() {
    this.api.getList().subscribe(
      (items) => this.locations = items,
      (error) => this.toastService.error(error)
    )
  }

  goToCreateForm() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  goToUpdateForm(id) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  private deleteLocation(id) {
    this.api.delete(id).subscribe(
      (response) => this.getItems(),
      (error) => this.toastService.error(error)
    )
  }

  showConfirm(locationId) {
    if(confirm(this.translate.instant('ADMIN.DELETE_LOCATION_CONF'))) {
      this.deleteLocation(locationId);
    }
  };
}
