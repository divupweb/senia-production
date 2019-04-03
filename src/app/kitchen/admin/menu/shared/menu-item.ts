export class MenuItem {
  menuItem;
  dish;
  date;
  passed = false;

  constructor(public category, private subscription) {}

  toParams() {
    let params: any = {
      subscription: this.subscription,
      dish_id: this.dish.id,
      date: this.dateFormatted,
      dish_category_id: this.category.id
    };
    if (this.menuItem && this.menuItem.id) params.id = this.menuItem.id;

    return params;
  }

  private get dateFormatted() {
    return this.date.format();
  }
}
