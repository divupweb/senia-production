import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
@Injectable()
export class HeaderService {
  private titleSource = new Subject<any>();
  private basketSource = new ReplaySubject<any>(1);
  private suspendSource = new Subject<any>();
  private unlockSource = new Subject<any>();

  titleUpdate$ = this.titleSource.asObservable();
  basketUpdate$ = this.basketSource.asObservable();
  suspendUpdate$ = this.suspendSource.asObservable();
  unlockRequest$ = this.unlockSource.asObservable();

  setTitleInfo(title = 'FoodFarm', info = '', backButton = null) {
    const titleInfo = {
      title: title,
      info: info,
      backButton: backButton
    };

    this.setBasketInfo(null);

    this.titleSource.next(titleInfo);
  }

  setBasketInfo(basketInfo) {
    this.basketSource.next(basketInfo);
  }

  public suspendChanged(dates: string[]): void {
    this.suspendSource.next(dates);
  }

  public openSuspendPlanner(date: string): void {
    this.unlockSource.next(date);
  }
}
