import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'admin-pagination',
  styleUrls: ['admin-pagination.scss'],
  templateUrl: './admin-pagination.html',
  encapsulation: ViewEncapsulation.None
})

export class AdminPaginationComponent {
  @Input() id;
  @Input() directionLinks = true;
  @Output() getPage = new EventEmitter();

  pageChange(event) {
    this.getPage.emit(event);
  }
}
