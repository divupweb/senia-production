import {Component, HostListener, Input } from '@angular/core'
import {LoginFormRequestService} from "app/home/shared";

@Component({
  selector: 'enterprise-region-header',
  styleUrls: [ 'enterprise-region-header.scss'],
  templateUrl: './enterprise-region-header.html'
})

export class EnterpriseRegionHeaderComponent {
  public firstBlock: number = 40;
  public scrolled: boolean = false;

  @HostListener('window:scroll', ['$event']) checkScroll(event) {
     this.scrolled = (document.body.scrollTop || window.pageYOffset || document.documentElement.scrollTop) > this.firstBlock;
  }
  @Input() logo;

  public constructor(public loginForm: LoginFormRequestService) {}
 }
