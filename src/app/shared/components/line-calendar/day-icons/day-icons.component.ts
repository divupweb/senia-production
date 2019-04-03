import { Component, Input } from '@angular/core';

@Component({
  selector: 'day-icons',
  styleUrls:  ['day-icons.scss'],
  templateUrl: './day-icons.html'
})

export class DayIcons {
  @Input() icons;
}
