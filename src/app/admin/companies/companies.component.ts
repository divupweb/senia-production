import { Component } from '@angular/core';
import { SharedLocationsApiService } from './shared';
@Component({
  selector: 'admin-companies',
  templateUrl: './companies.html',
  providers: [SharedLocationsApiService]
})

export class AdminCompaniesComponent { }
