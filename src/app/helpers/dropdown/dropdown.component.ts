import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef, ViewChild, ContentChild, TemplateRef
} from '@angular/core';
import { NgZone } from '@angular/core';
import { ToastService } from "../../services";
import {InputDebounceComponent} from "app/helpers/input-debounce";


@Component({
  selector: 'dropdown',
  styleUrls: ['dropdown.scss'],
  templateUrl: './dropdown.html',
  host: {
    "(document: click)": "onDocumentClick( $event )",
  }
})

export class DropdownComponent {

  @ContentChild(TemplateRef)
  public templateRef;

  lastQuery = '';

  itemList = [];
  showItems = false;
  _itemslength = 10;

  @ViewChild('control')
  public input: InputDebounceComponent;

  get nativeElement(): any {
    return this.input.nativeControl.nativeElement;
  }

  @Input() classes: string = "v3 in-table";
  @Input() placeholder = "";
  @Input() active = true;
  @Input() query = '';
  @Input() readonly: boolean = false;
  @Input() other: { id?: any, name?: any }|null = null;
  @Input() showSuggestions: boolean = true;
  @Input()
  set itemslength(length: number) {
    this._itemslength = Math.max(length, 2) + 0.2;
  }
  get itemslength() {
    return this._itemslength * 2;
  } // 2 - line scale

  @Input() updateItemsFn;
  @Output() onChange = new EventEmitter();
  @Output() onClear = new EventEmitter();
  @Output() onTyping = new EventEmitter();

  constructor(public toast: ToastService,
              public zone: NgZone,
              private el: ElementRef) { }

  public clearSearch(): void {
    setTimeout(() => {
      this.query = null;
      this.lastQuery = '';
    }, 50);
  }

  onQueryChange(query) {
    if (query == this.lastQuery) return;
    this.onTyping.emit(query);

    this.lastQuery = query;
    if (!query) this.sendClear(query);


    if (!query || query.length < 1) {
      this.loadItems([]);
      return;
    }
    if (this.showSuggestions) {
      this.updateItemList(query);
    }
  }

  private updateItemList(query) {
    this.updateItemsFn(query).subscribe(
      data => {
        this.loadItems(data);
      },
      error => {
        this.toast.error(error)
      }
    )
  }

  private loadItems(data) {
    this.itemList = data;
    this.itemslength = data.length;
    this.showItems = this.itemList.length > 0;
    this.zone.run(() => { }); // force update ui
  }

  onItemSelect(e) {
    this.closeDropdown();
    this.onChange.emit(e)
  }

  onDocumentClick(event) {
    if (!this.el.nativeElement.contains(event.target)) this.showItems = false;
  }

  keyPress(event: KeyboardEvent) {
    switch (event.which) {
      case (27):
        this.closeDropdown();
        break;
    }
  }

  onFocus(event) {
    this.updateItemList(this.lastQuery);
  }

  public closeDropdown() {
    this.showItems = false;
  }

  private sendClear(e) {
    this.onClear.emit(e);
  }
}
