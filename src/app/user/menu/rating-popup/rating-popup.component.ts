import { Component, Input } from '@angular/core';
import { RatingsApiService } from "app/user/services";
import { ToastService } from "app/services";
import { Moment } from 'moment';
@Component({
  selector: 'rating-popup',
  providers: [],
  styleUrls: ['rating-popup.scss'],
  templateUrl: 'rating-popup.html'
})

export class RatingPopupComponent {

  @Input()
  public menuItem: {
    kitchenName?: string,
    displayUrl?: string,
    price?: string[]|string,
    name?: string,
    rating?: any
  } = {};

  @Input()
  public date: any|Date|string|Moment;

  public max: number = 5;
  public score: number = 0;
  public comment: string = "";

  protected state: boolean = false;

  public constructor(protected api: RatingsApiService, protected toast: ToastService) {}

  public ngOnChanges(params): void {
    if (_.get(params,'menuItem.currentValue')) {
     this.comment = _.get(this.menuItem, 'rating.comment');
    }
  }

  public show(): void {
    this.state = true;
  }

  public close(): void {
    this.state = false;
  }

  public apply(menuItem): RatingPopupComponent {
    this.menuItem = menuItem;
    this.score = 0;
    this.comment = '';
    return this;
  }

  public isNew(): boolean {
    return !_.get(this.menuItem.rating, 'id')
  }

  public save(): void {
    this.api.create([_.merge(this.menuItem.rating, { score: this.score, comment: this.comment })])
      .subscribe((ratings) => {
        _.merge(this.menuItem.rating, _.first(ratings));
        this.close();
      }, (error) => this.toast.error(error))
  }

}
