import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AuthService,
  AppStateService,
  AccountsProxy
} from 'app/services';
import { TermsAndConditionsService } from 'app/shared';
import {LoginFormRequestService} from "app/home/shared";
import {LoginComponent} from "app/shared/auth/login";

@Component({
  selector: 'home',
  styleUrls: ['home.scss'],
  templateUrl: './home.html'
})

export class HomeComponent implements AfterViewInit {

  @ViewChild('login')
  public loginComponent: LoginComponent;

  constructor(
    private state: AppStateService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private tocState: TermsAndConditionsService,
    private router: Router,
    private accounts: AccountsProxy,
    private element: ElementRef,
    protected formRequest: LoginFormRequestService
  ) {
    this.login();
  }

  ngOnInit() {
    this.accounts.getAll().subscribe();
    this.formRequest.requested$.subscribe(() => this.loginComponent.open());
  }

  ngAfterViewInit() {
    this.initToc();
  }

  login() {
    let redirect = 2;
    if (/privacy-policy|cookie-policy|terms-of-service|terms-of-service-kitchen/.test(this.router.url) ) {
      redirect = null;
    }
    if (this.state.currentUser()) this.auth.currentUser(redirect);
  }

  public onDeactivate(): void {
    this.element.nativeElement.scrollIntoView();
  }

  private initToc() {
    this.checkToc();
    this.removeTocOnClose();
  }

  private checkToc() {
    this.route.queryParams.subscribe(
      (params) => {
        if (params['toc']) this.tocState.open();
      }
    )
  }

  private removeTocOnClose() {
    this.tocState.update.subscribe((r) => {
      if (!r) this.removeQuery()
    });
  }

  private removeQuery() {
    let query = Object.assign({},this.route.snapshot.queryParams);
    delete query.toc;
    this.router.navigate([], { relativeTo: this.route, queryParams: query });
  }
}
