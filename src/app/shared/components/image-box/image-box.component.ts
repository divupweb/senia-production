import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'image-box',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['image-box.scss'],
  templateUrl: './image-box.html'
})

export class ImageBoxComponent {
  @Input() imageUrl: string;
  @Output() onDelete = new EventEmitter();

  deleteImageClick(event) {
    this.onDelete.emit(event);
  }
}
