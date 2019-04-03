import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStateService } from './user-state.service';
import { ApiClientService } from 'app/services';

@Injectable()
export class UserSettingsApiService {
  constructor(protected apiClient: ApiClientService,
              protected userState: UserStateService) { }

  baseUrl = '/settings';

  get(): Observable<any> {
    let subscription = this.apiClient.get(this.baseUrl);
    let fn = (resp) => this.updateUser(resp.user);
    return this.createObserver(subscription, fn);
  }

  update(params): Observable<any> {
    let data = JSON.stringify(params);
    let subscription = this.apiClient.put(this.baseUrl, data);
    let fn = (resp) => {
      this.updateUser(resp)
    };
    return this.createObserver(subscription, fn);
  }

  private createObserver(subscription, fn): Observable<any> {
    return Observable.create((observer) => {
      subscription.map((r) => r.json()).subscribe(
        (r) => {
          fn.call(this, r);
          observer.next(r);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        });
    });
  }

  private updateUser(user): void {
    this.userState.setUser(user);
  }
}
