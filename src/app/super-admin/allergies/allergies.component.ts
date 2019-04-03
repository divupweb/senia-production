import { Component } from '@angular/core';
import {
  AdminAllergyImagesService,
  AdminAllergiesService
} from './services'


@Component({
  selector: 'admin-allergies',
  providers: [ AdminAllergyImagesService, AdminAllergiesService ],
  templateUrl:'./allergies.html'
})

export class AdminAllergiesComponent {}
