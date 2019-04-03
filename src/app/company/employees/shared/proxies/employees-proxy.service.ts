import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { EmployeesApiService } from '../api-services';
import {CollectionProxy, ToastService} from 'app/services';

@Injectable()
export class EmployeesProxyService extends CollectionProxy {

  public get employees() {
    return this.collection;
  }

  public set employees(value) {
    this.collection = value;
  }

  constructor(protected apiService: EmployeesApiService, protected toast: ToastService) {
    super(toast);
    this.getAll(true);
  }

  public get(id: string) {
    return this.apiService.get(id);
  }

  public update(id, data, subsidies, subscriptions) {
    return Observable.create((subject) =>
      this.apiService.update(id, data, subsidies, subscriptions)
        .subscribe((response) => {
          let object = _.find(this.collection, { id });
          if (object) {
            _.merge(object, response.employee);
          }
          this.loaded.next(true);
          subject.next(response);
        }, (error) => subject.error(error))
    );
  }

  public create(data, subsidies, subscriptions) {
    return Observable.create((subject) =>
      this.apiService.create(data, subsidies, subscriptions)
        .subscribe((user) => {
          this.employees.push(user);
          this.loaded.next(true);
          subject.next(user);
        }, (error) => subject.error(error))
    );
  }
  public setActive(id: number, active: boolean = false): Observable<any> {
    return Observable.create((subject) =>
      this.apiService.setActive(id, active)
        .subscribe((data) => {
          subject.next(data);
        }, (error) => subject.error(error))
    );
  }

  public remove(id) {
    return Observable.create((subject) =>
      this.apiService.remove(id)
        .subscribe((data) => {
          _.remove(this.collection, { id });
          this.loaded.next(true);
          subject.next(data);
        }, (error) => {
          subject.error(error);
        })
    );
  }

  protected loadCollection(): Observable<any> {
    return this.apiService.getAll();
  }
}
