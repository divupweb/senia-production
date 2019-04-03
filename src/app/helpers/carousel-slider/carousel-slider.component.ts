import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FavoriteKitchensService } from 'app/company/shared';
import { ToastService } from 'app/services';

@Component({
  selector: 'carousel-slider',
  providers: [FavoriteKitchensService],
  styleUrls: ['carousel-slider.scss'],
  templateUrl: './carousel-slider.html',
})

export class CarouselSliderComponent {

  @Input() items = [];
  @Input() selected;

  @Input()
  public showFavorite: boolean = true;

  favoritesValue = [];
  @Input()
  get favorites() {
    return this.favoritesValue;
  }
  set favorites(val) {
    this.favoritesValue = val;
    this.favoritesChange.emit(this.favoritesValue);
  }
  @Input() sort = true;
  @Output() favoritesChange = new EventEmitter();
  @Output() onSelect = new EventEmitter();

  public config: any = {
    nextButton: '.button-next',
    prevButton: '.button-prev',
    slidesPerView: 'auto',
    spaceBetween: -7
  };

  constructor(private api: FavoriteKitchensService,
              private toast: ToastService) {}

  ngOnChanges() {
    this.resortItems();
  }

  private fillFavorites() {
    const favorites = this.favorites;
    const isFavorite = (e) => {
      return favorites.indexOf(e.id) > -1;
    };
    if (this.items) {
      this.items.forEach( (e) => { e.favorite = isFavorite(e); })
    }
  }

  setActive(item) {
    this.selected = item;
    this.onSelect.emit(this.selected);
  }

  onFavoriteClick(event, item) {
    event.stopPropagation();
    let observer;
    if (item.favorite) observer = this.api.remove(item.id);
    else observer = this.api.add(item.id);

    observer.subscribe(
      (data) => {
        this.favorites = data;
        this.fillFavorites();
      }, (error) => this.toast.error(error)
    )
  }

  private resortItems() {
    if (!this.sort) return;
    this.items = _.orderBy(this.items, ['own', 'favorite', 'name'], ['desc', 'desc'])
  }
}
