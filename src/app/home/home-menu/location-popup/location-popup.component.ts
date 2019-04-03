import {Component, EventEmitter, Input, Output} from '@angular/core'

@Component({
  selector: 'location-popup',
  templateUrl: './location-popup.html',
  styleUrls: ['../../../shared/auth/home-auth.scss' ,'location-popup.scss']
})

export class LocationPopupComponent {

  public state: boolean = false;
  @Input()
  public locations: any[] = [];

  @Output()
  public onSelect: EventEmitter<any> = new EventEmitter();

  public open(): void {
    setTimeout(() => this.state = true, 50);
  }

  public close(): void {
    this.state = false;
  }

  public select(location): void {
    this.onSelect.emit(location);
    this.close();
  }

}
