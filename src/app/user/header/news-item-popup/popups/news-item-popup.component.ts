import { Input, EventEmitter, Output } from '@angular/core';

export class NewsItemPopupComponent {
  @Input() item;
  @Output() onClose = new EventEmitter();

  close(event) {
    if (event) event.stopPropagation();
    this.onClose.emit(false);
    return false
  }
}
