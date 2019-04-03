import { Pipe } from "@angular/core";

@Pipe({
  name: 'nameFilter'
})
export class NameFilterPipe {
  private contain(item, q, columns) {
    let search = columns.map((e) => _.get(item, e).toLowerCase());
    return search.some((e) => -1 < e.indexOf(q))
  }

  private buildColumns(column) {
    let columns;
    if (!column) {
      columns = ['name']
    } else if (_.isArray(column)) {
      columns = column
    } else {
      columns = [column];
    }
    return columns;
  }

  transform(items: any, q: string, column = null) {
    if (!q || q === '') {
      return items;
    }
    let qLower = q.toLowerCase();
    let columns = this.buildColumns(column);

    return items.filter((item) => this.contain(item, qLower, columns));
  }
}
