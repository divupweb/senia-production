import { Component, Input } from '@angular/core';

@Component({
  selector: 'dish-rating',
  templateUrl: './dish-rating.component.html',
  styleUrls: ['../notification-item.scss', './dish-rating.component.scss']
})
export class DishRatingComponent {
  @Input() item;
  information;

  ngOnInit() {
    this.information = _.get(this.item, 'information.item');
  }
}
