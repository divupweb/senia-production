import {Component, Renderer2} from '@angular/core';

@Component({
  selector: 'terms-and-conditions-kitchen-ext',
  templateUrl: './terms-and-conditions-kitchen-ext.html',
  styleUrls: ['terms-and-conditions-kitchen-ext.scss']
})

export class TermsAndConditionsKitchenExtComponent {

    constructor(private renderer: Renderer2) {}

    ngAfterViewInit() {
      if (this.renderer) {
        this.renderer.setStyle(document.querySelector('home-header'), 'background-color', '#fff');
      }
    }
}
