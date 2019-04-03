import { Subject } from 'rxjs/Subject';

export class MenuWizard {
  category;
  items = [];
  activeDays = _.map(new Array(5), (e) => true);
  private source = new Subject();
  onClose = this.source.asObservable();

  constructor(
    private menu,
    private date,
    private dishesService) { }


  setCategory(category = null) {
    this.category = category ? this.findCategory(category) : this.firstCategory();
  }

  nextCategory() {
    let i = this.hasNextCategory();
    if (i !== false) {
      this.category = this.menu.categories[i + 1];
      this.build()
    }
  }

  previousCategory() {
    let i = this.hasPreviousCategory();
    if (i !== false) {
      this.category = this.menu.categories[i - 1];
      this.build();
    }
  }

  private hasNextCategory() {
    let i = this.findIndex();
    return (i >= this.menu.categories.length - 1) ? false : i;
  }

  private hasPreviousCategory() {
    let i = this.findIndex();
    return (i <= 0) ? false : i;
  }

  private findIndex() {
    return _.findIndex(this.menu.categories, { id: this.category.id });
  }

  private findCategory(category) {
    return _.find(this.menu.categories, { id: category.id });
  }

  private firstCategory() {
    return this.menu.categories[0];
  }

  build() {
    this.items = [];
    if (!this.category) return;
    this.items = _.map(this.dishesService.byCategory(this.category), this.buildItem.bind(this));
    this.buildActiveDays();
  }

  private buildItem(dish) {
    return {
      dish,
      days: this.buildDays(dish)
    };
  }

  private buildDays(dish) {
    let menuItems = _.find(this.menu.items, { category: this.category});
    return _.map(menuItems.dishes, (e, i) => this.buildDay(e, dish, i));
  }

  private buildDay(menuItem, dish, day) {
    return {
      passed: menuItem.passed,
      active: _.get(menuItem.dish, 'id') == dish.id,
      menuItem,
      day
    }
  }

  onItemChange(item, event) {
    let dayItem = item.days[event.day];
    dayItem.active = event.value;
    this.activeDays = (() => {
      let days = this.activeDays.slice();
      days[event.day] = event.value;
      return days
    })();
    if (event.value) {
      _.each(this.items, (e) => {
        if (item == e) return;
        e.days[event.day].active = false;
      });
    }

    if (_.every(this.activeDays, (e) => e == true)) {
      if (this.hasNextCategory() !== false) {
        this.nextCategory();
      } else {
        this.sendClose();
      }
    }
    this.menu.updateItem(dayItem.menuItem, item.dish);
  }

  private buildActiveDays() {
    this.activeDays = [];
    for(let i= 0; i < 5; i++) {
      this.activeDays.push(this.dayActive(i));
    }
  }

  private dayActive(i) {
    return _.some(this.items, (item) => item.days[i].active == true);
  }

  private sendClose() {
    this.source.next(true);
    this.source.complete();
  }
}
