import {Component, HostListener, ViewChild} from '@angular/core'
import {LoginComponent} from "app/home/auth";
import {LoginFormRequestService} from "app/home/shared";

@Component({
  selector: 'home-header',
  styleUrls: [ 'home-header.scss'],
  templateUrl: './home-header.html'
})

export class HomeHeaderComponent {
  public firstBlock: number = 40;
  public scrolled: boolean = false;

  @HostListener('window:scroll', ['$event']) checkScroll(event) {
     this.scrolled = (document.body.scrollTop || window.pageYOffset || document.documentElement.scrollTop) > this.firstBlock;
  }

  constructor(public loginForm: LoginFormRequestService) {}
 }
