import { Component, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'subscription-component',
  templateUrl: './subscription.html',
  styleUrls: ['kitchen-form.scss']
})

export class SubscriptionComponent {
  showCategorySelect = false;
  categoriesWithoutAdded = [];

  @Input() subscription;
  @Input() title;
  @Input() categories;
  @Input() readOnly = false;;

  constructor(private el: ElementRef) {
    el.nativeElement.addEventListener('click', this.onHostClick.bind(this), true); // catch capturing
  }

  private onHostClick(event) {
    if (this.readOnly) event.stopPropagation();
  }

  ngOnChanges(changes) {
    if (changes["categories"]) {
      this.filterCategories();
    }
  }

  getCategory(kdc) {
    return _.find(this.categories, {id: kdc.dishCategoryId})
  }

  filterCategories() {
    let ids = _.map(this.subscription.kitchenDishCategoriesAttributes, (a) => {
      if (a.active) return a.dishCategoryId;
    })
    this.categoriesWithoutAdded = _.filter(this.categories, (cat) => ids.indexOf(cat.id) == -1);
  }

  toggleCategorySelect(state = !this.showCategorySelect) {
    let timeout = state ? 50 : 0;
    setTimeout(() => this.showCategorySelect = state, timeout);
  }

  toggleDishCategory(kdc, status) {
    if (kdc.id) {
      Object.assign(kdc, {active: status})
    } else if (status == false) {
      _.remove(this.subscription.kitchenDishCategoriesAttributes, kdc);
    };

    this.filterCategories();
    this.toggleCategorySelect(false);
  }

  addDishCategory(dishCategoryId) {
    let params = { dishCategoryId: dishCategoryId };
    let kdc = _.find(this.subscription.kitchenDishCategoriesAttributes, params);
    if (!kdc) {
      kdc = Object.assign(params, { active: true });
      this.subscription.kitchenDishCategoriesAttributes.push(kdc)
    };

    this.toggleDishCategory(kdc, true);
  }
}
