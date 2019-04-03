import { Injectable } from '@angular/core';
import { ToastService } from "app/services";
import { SuspendsApiService } from './suspends-api.service';
import { Observable, Subject } from "rxjs";


@Injectable()
export class SuspendsDataService {
  items = [];
  events = [];
  private eventsLoaded = false;

  paginationConfig = {
    id: 'suspends-index',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 1
  };

  constructor(
    private api: SuspendsApiService,
    private toast: ToastService) {}

  getPage(page = this.paginationConfig.currentPage) {
    if (!page) page = 1;
    let params = {
      page: page,
      per_page: this.paginationConfig.itemsPerPage
    };

    this.api.index(params).subscribe(
      (response) => {
        this.paginationConfig.currentPage = page;
        this.paginationConfig.totalItems = response.total;
        this.items = response.items;
      },
      (error) => this.toast.error(error)
    )
  }

  public getPendingEvents(): Observable<any> {
    return this.api.pending();
  }

  delete(item) {
    this.api.delete(item.date, item.date).subscribe(
      (response) => this.getPage(),
      (error) => this.toast.error(error)
    )
  }

  public deleteById(ids: number[]): Observable<any> {
    return this.api.deleteById(ids);
  }

  get(id) {
    let item = _.find(this.items, { id: +id });
    return item ? Observable.from([item]) : this.loadSuspend(id)
  }

  getEvents() {
    return this.eventsLoaded ? Observable.from([this.events]) : this.loadEvents()
  }

  private loadSuspend(id) {
    return this.api.get(id);
  }

  private loadEvents() {
    let subject = new Subject();

    this.api.events().subscribe(
      (response) => {
        this.eventsLoaded = true;
        this.events = response;

        subject.next(this.events);
        subject.complete();
      },
      (error) => {
        this.toast.error(error);
        subject.error(error);
        subject.complete();
      }
    )

    return subject.asObservable();
  }
}
