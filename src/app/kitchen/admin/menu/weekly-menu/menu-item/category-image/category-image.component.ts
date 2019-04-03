import { Component, Input } from '@angular/core';

@Component({
  selector: 'category-image',
  templateUrl: './category-image.component.html',
  styleUrls: ['./category-image.component.scss']
})
export class CategoryImageComponent {

  @Input() setMenu;
  @Input() item;
}
