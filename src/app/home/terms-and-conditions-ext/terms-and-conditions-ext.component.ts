import {Component, Renderer2} from '@angular/core';

@Component({
  selector: 'terms-and-conditions-ext',
  templateUrl: './terms-and-conditions-ext.html',
  styleUrls: ['terms-and-conditions-ext.scss']
})

export class TermsAndConditionsExtComponent {

    constructor(private renderer: Renderer2) {}

    ngAfterViewInit() {
      if (this.renderer) {
        this.renderer.setStyle(document.querySelector('home-header'), 'background-color', '#fff');
      }
    }
}
