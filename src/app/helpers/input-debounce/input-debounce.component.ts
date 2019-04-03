import {Component, Input, Output, ElementRef, EventEmitter, ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'input-debounce',
  styleUrls: ['input-debounce.scss'],
  templateUrl: './input-debounce.html'
})
export class InputDebounceComponent {
  @Input() placeholder: string;
  @Input() delay: number = 300;
  @Input() inputValue: string;
  @Input() classes: string = "v3 in-table";
  @Input() readonly: boolean = false;
  @Output() value = new EventEmitter();
  @Output() onFocus = new EventEmitter();

  @ViewChild('control')
  public nativeControl: ElementRef;
  constructor(private elementRef: ElementRef) {
    const eventStream = Observable.fromEvent(elementRef.nativeElement, 'keyup')
      .map(() => this.inputValue)
      .debounceTime(this.delay)
      .distinctUntilChanged();

    eventStream.subscribe(input => this.value.emit(input));
  }

  onFocusEvent(e) {
    this.onFocus.emit(e);
  }
}
