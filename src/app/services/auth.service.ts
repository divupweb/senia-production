import {Injectable} from '@angular/core';
import {Router} from '@angular/router'
import { Subject, Observable } from 'rxjs';
import { ApiClientService, AppStateService, ToastService } from 'app/services';
import {TranslateService} from "@ngx-translate/core";


@Injectable()
export class AuthService {

  protected codesForHandling: number[] = [422];

  constructor(private _apiClient: ApiClientService,
              private _router: Router,
              private _state: AppStateService,
              private toastService: ToastService,
              protected translate: TranslateService) {}

  public data = {email: '', password: ''};

  private authData() {
    return JSON.stringify({
      email: this.data.email,
      password: this.data.password
    });
  }

  handleResponse(request, redirect: number = 1) {
    let source = new Subject();
    request.subscribe(
      (response) => {
        let data = response.json();
        const account = this._state.currentAccount();
        this._state.set('current', _.get(data, 'user', data));
        this._state.setAccount(_.get(data, 'account', null));
        this._state.set('company',_.get(data, 'company', null));
        this.checkCurrentLang();
        if (redirect) {
          let url;
          if (this._state.currentUser()) {
            url = [this.currentUserRootArea()];
          } else if (redirect == 1) {
            let [enterprise, slug] = _.map(['enterprise', 'slug_name'], (key) => _.get(account, key, ''));
            if (enterprise && slug) {
              url = ['/region', slug]
            } else {
              url = ['/'];
            }
          }
          if (url) this._router.navigate(url);
        }
        source.next(response);
        source.complete();
      },
      (error) => {
        if (_.includes(this.codesForHandling, error.status)) {
          source.error(error);
        } else {
          this.toastService.error(error);
        }
      }
    );
    return source.asObservable();
  }

  submitLogin(): Observable<any> {
    return this.handleResponse(
      this._apiClient.post('/login', this.authData())
    )
  }

  submitLogout() {
    this.handleResponse(
      this._apiClient.post('/logout')
    )
  }

  public changePassword(data: { password: string, old_password: string, password_confirmation: string }): Observable <any> {
    return this._apiClient.put('/users/password', JSON.stringify(data));
  }
  public updateCurrentUser(data: any): Observable<JSON> {
    return this._apiClient.put('/users', JSON.stringify(data)).map((r) => r.json());
  }

  public currentAdmin(): Observable<any> {
    return this._apiClient.get('/users/current/admin').map((r) => r.json());
  }

  currentUser(redirect: number = 1) {
    let request = this._apiClient.get('/users/current');
    let observer = this.handleResponse(request, redirect);
    observer.subscribe(
      (response: any) => {
        let data = response.json();
        this._state.set('company', data.company);
        this._state.set('kitchen', data.kitchen);
        this._state.setAccount(data.account);
      }
    );
    return observer;
  }

  public getLink() {
    let link: string[] = [];
    if (this._state.currentUser()) {
      link.push(this.currentUserRootArea());
    } else {
      link.push('/');
    }
    return link
  }

  private currentUserRootArea() {
    if (this._state.fakeCompanyAdmin()) { return '/fake-company' }
    if (this._state.fakeKitchenAdmin()) { return '/fake-kitchen' }
    if (this._state.companyAdmin()) { return '/company' }
    if (this._state.kitchenAdmin()) { return '/kitchen' }
    if (this._state.kitchenEmployeeUser()) { return '/employee/kitchen' }
    if (this._state.admin()) { return '/admin' }
    if (this._state.kitchenDeliveryUser()) { return '/kitchen-delivery' }
    if (this._state.driverUser()) { return '/driver' }
    if (this._state.logisticsUser()) { return '/logistics' }
    if (this._state.kitchenLogisticsUser()) {return '/logistics/kitchen' }
    if (this._state.kitchenDriverUser()) { return '/driver/kitchen' }
    if (this._state.superAdmin()) { return '/super' }
    if (this._state.signUpUser()) { return '/sign-up-wizard' }
    return '/user'
  }

  protected checkCurrentLang() {
    const appLang = this._state.getLang();
    const userLocale = _.get(this._state.currentUser(), 'locale', appLang);
    if (!_.isEmpty(appLang) && appLang != userLocale) {
      this._state.setLang(userLocale);
    }
  }
}
