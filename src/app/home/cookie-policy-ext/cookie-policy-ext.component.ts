import {Component, Renderer2} from '@angular/core';

@Component({
  selector: 'cookie-policy-ext',
  templateUrl: './cookie-policy-ext.html',
  styleUrls: ['cookie-policy-ext.scss']
})

export class CookiePolicyExtComponent {

    constructor(private renderer: Renderer2) {}

    ngAfterViewInit() {
      if (this.renderer) {
        this.renderer.setStyle(document.querySelector('home-header'), 'background-color', '#fff');
      }
    }
}
