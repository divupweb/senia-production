import { Component, Input } from '@angular/core';

@Component({
  selector: 'default',
  templateUrl: './default.component.html',
  styleUrls: ['../notification-item.scss']
})
export class DefaultComponent {
  @Input() item;
}
