import { Component, Input } from '@angular/core';

@Component({
  selector: 'votes-popup',
  templateUrl: './votes-popup.html',
  styleUrls: ['votes-popup.scss'],
})

export class VotesPopupComponent {
  show = false;
  @Input() ratings;

  open() {
    this.show = true;
  }

  close(event) {
    if (event && event.stopPropagation) event.stopPropagation();
    this.show = false;
  }
}
