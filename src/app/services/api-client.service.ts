import { Http, Headers, RequestOptions, URLSearchParams, Response } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/catch";
import "rxjs/add/operator/finally";
import "rxjs/add/observable/throw";
import "rxjs/add/observable/empty";
import { SpinnerService } from '../helpers/spinner';
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class ApiClientService {

  constructor(@Inject(Http) private http: Http,
              private router: Router,
              private spinner: SpinnerService,
              protected translate: TranslateService) {
    // TODO: Use official Angular2 CORS support when merged (https://github.com/angular/http/issues/65).
    let _build = (<any> http)._backend._browserXHR.build;
    (<any> http)._backend._browserXHR.build = () => {
      let _xhr =  _build();
      _xhr.withCredentials = true;
      return _xhr;
    };
  }

  private requestOptions(options = {}) {
    let headers = new Headers();

    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Accept-Language', this.translate.currentLang);

    if (options.hasOwnProperty('headers')) {
      _.each(options['headers'], (v, k) => {
        if (v === null) {
          headers.delete(k);
        } else {
          headers.set(k, v);
        }
      })
    }
    let req = Object.assign(options, { headers: headers });
    return new RequestOptions(req);
  }

  fullPath(url) {
    return BASE_API_URL + url;
  }

  get(url, params = null) {
    let options = this.buildParams(params);
    return this.intercept(this.http.get(this.fullPath(url), options));
  }

  post(url, data: any ='{}') {
    let options;
    if (data instanceof FormData) options = { headers: { 'Content-Type': null } };
    let reqOptions = this.requestOptions(options);
    let observer = this.http.post(this.fullPath(url), data, reqOptions);
    return this.intercept(observer);
  }

  put(url, data: any ='{}') {
    let options;
    if (data instanceof FormData) options = { headers: { 'Content-Type': null } };
    let reqOptions = this.requestOptions(options);
    let observer = this.http.put(this.fullPath(url), data, reqOptions);
    return this.intercept(observer);
  }

  delete(url, params = null) {
    let options = this.buildParams(params);
    return this.intercept(this.http.delete(this.fullPath(url), options));
  }

  private buildParams(params) {
    let options = this.requestOptions();

    if (params) {
      let search = new URLSearchParams();
      for (var key in params) {
        if (_.isArray(params[key])) {
          _.each(params[key], (value) => {
            search.append(key + '[]', value)
          })
        } else {
          search.set(key, params[key])
        }
      }
      options.search = search;
    }

    return options;
  }

  intercept(observable: Observable<Response>): any {
    this.spinner.show();
    return observable
          .catch((err, source) => {
            if (err.status  == 401) {
              this.router.navigate['/'];
              return Observable.empty();
            } else {
              return Observable.throw(err);
            }
          })
          .finally(() => { this.spinner.hide(); })
    ;
  }
}
