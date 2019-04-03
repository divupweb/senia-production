import { AccountsProxy } from "app/services";
import { Observable, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class NearestLocationService {

  protected radius: number = 100; // km

  protected currentPosition: Coordinates|null;

  public constructor(protected accountProxy: AccountsProxy, private t: TranslateService) {
    this.accountProxy.getAll().subscribe();
    this.setUpCurrentPosition().subscribe();
  }

  public get(): Observable<any> {
    return Observable.create((subject: Subject<any>) => {
      Observable.forkJoin([this.accountProxy.getAll(), this.setUpCurrentPosition()]).
        subscribe(() => {
          const coords = _.values(_.pick(this.currentPosition, ['latitude', 'longitude']));
          const nearest = _.minBy(this.accountProxy.collection, (location) => {
            const distance = this.calcDistanceBetween(location.location_point[0], location.location_point[1], coords[0], coords[1]);
            if (distance < this.radius) {
              return distance;
            }
          });
          if (nearest) {
            subject.next(nearest);
          }
          subject.complete();
      })
    });
  }

  protected setUpCurrentPosition(): Observable<any> {
    return Observable.create((subject: Subject<any>) => {
      if (this.currentPosition) {
        subject.next(this.currentPosition);
        subject.complete();
      } else if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: Position) => {
          this.currentPosition = position.coords;
          subject.next(this.currentPosition);
          subject.complete();
        }, () => this.currentPosition = null);
      } else {
        subject.complete();
        this.currentPosition = undefined;
        console.warn(this.t.instant('TOAST.ERROR.GEOLOCATION'));
      }
    })
  }


  protected calcDistanceBetween(lat1, lon1, lat2, lon2) {
    const toRad = (degree) => degree * Math.PI / 180;
    const R = 6371; // Radius of earth in km
    const dLat = toRad(lat2-lat1);
    const dLon = toRad(lon2-lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}
