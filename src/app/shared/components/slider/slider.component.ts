import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import {CurrencyFormatPipe} from "app/pipes/currency";
import {AppStateService} from "app/services";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'slider',
  styleUrls: ['slider.scss'],
  templateUrl: './slider.html',
  encapsulation: ViewEncapsulation.None
})

export class SliderComponent {
  @Input() max = 200;
  @Input() min = 0;
  @Input() displayLabels = true;
  @Input() showFree = true;

  _value;
  @Input()
  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this.valueChange.emit(this._value);
  }

  private freeValue;
  @Input()
  get free() {
    return this.freeValue;
  }
  set free(val) {
    this.freeValue = val;
    this.freeChange.emit(this.freeValue);
  }

  @Output() valueChange = new EventEmitter();
  @Output() onUpdateValue = new EventEmitter();
  @Output() freeChange = new EventEmitter();

  sliderConfig: any = {};
  freeLabel = this.translate.instant('SUBSIDIES.FREE');
  maxValue: any = this.freeLabel;

  public constructor(protected state: AppStateService, protected translate: TranslateService) {}

  ngAfterViewInit() {
    if (this.min === this.max && this.value != this.min) this.valueChange.emit(this.min);
  }

  ngOnChanges() {
    if (_.isArray(this.value)) {
      if (this.value.length == 2)
        this.sliderConfig.tooltips = [this.formatter, this.formatter]
    } else {
      this.sliderConfig.tooltips = [this.formatter]
    }
    this.maxValue = this.showFree ? this.freeLabel : this.max;
  }

  formatter: any = {
    to: (value) => {
      if (this.displayLabels && value == this.max) {
        return '';
      } else {
        return new CurrencyFormatPipe(this.state, this.translate).transform(value);
      }
    },

  };

  onChangeInput(event) {
    this.valueChange.emit(event);
  }

  onValueChange(value) {
    this.onUpdateValue.emit(value);
    this.value = value;
    this.free = this.max === value;
  }

  hideMin() {
    return this.value <= this.min + this.range();
  }

  hideMax() {
    return (this.value != this.max) && (this.value >= this.max - this.range());
  }

  private range() {
    return (this.max - this.min) * 0.2;
  }
}
