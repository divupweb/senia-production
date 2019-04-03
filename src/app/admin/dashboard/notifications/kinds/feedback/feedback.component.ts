import { Component, Input } from '@angular/core';

@Component({
  selector: 'feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['../notification-item.scss']
})
export class FeedbackComponent {
  @Input() item;

  constructor() { }

  ngOnInit() {
  }
}
