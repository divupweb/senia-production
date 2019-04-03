import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';

const KEYCODE_ESC = 27;
const TABINDEX = 1;

@Directive({
  selector: '[closePopup]'
})
export class ClosePopupDirective {
  @Output() onClosePopup = new EventEmitter();

  private initialized = false;
  private nativeEl;
  constructor(private el: ElementRef) {
    this.nativeEl = el.nativeElement;
    this.setAttributes();
  }

  ngOnInit() {
    setTimeout(() => {
      this.initialized = true;
      this.setFocus();
    })
  }

  private setAttributes() {
    this.setTabIndex();
    this.disableOutline();
  }

  private setTabIndex() {
    let tabindex = this.nativeEl.getAttribute('tabindex')  || TABINDEX;
    this.nativeEl.setAttribute('tabindex', tabindex);
  }

  private disableOutline() {
    if (!this.nativeEl.style.outline) this.nativeEl.style.outline = 'none';
  }

  private setFocus() {
    this.nativeEl.focus();
  }


  @HostListener('document:click', ['$event', '$event.target'])
  onClickOutside(event: MouseEvent, targetElement: HTMLElement) {
    if (!(this.initialized && targetElement && document.body.contains(targetElement))) return;

    let clickedInside = this.nativeEl.contains(targetElement);
    if (!clickedInside) this.onClosePopup.emit(event);
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (!this.initialized) return;
    if (event.keyCode === KEYCODE_ESC) this.onClosePopup.emit(event);
  }
}
