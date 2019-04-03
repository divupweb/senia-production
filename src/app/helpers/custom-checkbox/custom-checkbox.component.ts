import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Provider,
  Renderer,
  ViewEncapsulation,
  forwardRef,
  AfterContentInit
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';

/**
 * Monotonically increasing integer used to auto-generate unique ids for checkbox components.
 */
let nextId = 0;

/**
 * Provider Expression that allows checkbox to register as a ControlValueAccessor. This allows it
 * to support [(ngModel)] and ngControl.
 */

const SWITCH_CHECKBOX_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomCheckboxComponent),
  multi: true
}

/**
 * Represents the different states that require custom transitions between them.
 */
enum TransitionCheckState {
  /** The initial state of the component before any user interaction. */
  Init,
  /** The state representing the component when it's becoming checked. */
  Checked,
  /** The state representing the component when it's becoming unchecked. */
  Unchecked,
  /** The state representing the component when it's becoming indeterminate. */
  Indeterminate
}

// A simple change event emitted by the MdCheckbox component.
export class CustomCheckboxChange {
  source: CustomCheckboxComponent;
  checked: boolean;
}


@Component({
  selector: 'custom-checkbox',
  templateUrl: './custom-checkbox.html',
  styleUrls: ['custom-checkbox.scss'],
  providers: [SWITCH_CHECKBOX_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomCheckboxComponent {
  /**
   * Attached to the aria-label attribute of the host element. In most cases, arial-labelledby will
   * take precedence so this may be omitted.
   */
  @Input() ariaLabel: string = '';

  /**
   * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
   */
  @Input() ariaLabelledby: string = null;

  @Input() iconClass = '';

  @Input() classes: string = '';

  /** A unique id for the checkbox. If one is not supplied, it is auto-generated. */
  @Input() id: string = `custom-checkbox-${++nextId}`;

  /** ID to be applied to the `input` element */
  get inputId(): string {
    return `input-${this.id}`;
  }

  /**
   * Whether the checkbox is disabled. When the checkbox is disabled it cannot be interacted with.
   * The correct ARIA attributes are applied to denote this to assistive technology.
   */
  @Input() disabled: boolean = false;

  /**
   * The tabindex attribute for the checkbox. Note that when the checkbox is disabled, the attribute
   * on the host element will be removed. It will be placed back when the checkbox is re-enabled.
   */
  @Input() tabindex: number = 0;

  /** Name value will be applied to the input element if present */
  @Input() name: string = null;

  /** Event emitted when the checkbox's `checked` value changes. */
  @Output() change: EventEmitter<CustomCheckboxChange> = new EventEmitter<CustomCheckboxChange>();

  /** Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor. */
  onTouched: () => any = () => { };

  /** Whether the `checked` state has been set to its initial value. */
  private _isInitialized: boolean = false;

  private _currentCheckState: TransitionCheckState = TransitionCheckState.Init;

  private _checked: boolean = false;

  private _indeterminate: boolean = false;

  private _controlValueAccessorChangeFn: (value: any) => void = (value) => { };

  hasFocus: boolean = false;

  constructor(private _renderer: Renderer, private _elementRef: ElementRef) { }

  /**
   * Whether the checkbox is checked. Note that setting `checked` will immediately set
   * `indeterminate` to false.
   */
  @Input() get checked() {
    return this._checked;
  }

  set checked(checked: boolean) {
    if (checked != this.checked) {
      this._indeterminate = false;
      this._checked = checked;
      this._transitionCheckState(
        this._checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);

      // Only fire a change event if this isn't the first time the checked property is ever set.
      if (this._isInitialized) {
        this._emitChangeEvent();
      }
    }
  }

  /** TODO: internal */
  ngAfterContentInit() {
    this._isInitialized = true;
  }

  /**
   * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
   * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
   * checkable items. Note that whenever `checked` is set, indeterminate is immediately set to
   * false. This differs from the web platform in that indeterminate state on native
   * checkboxes is only remove when the user manually checks the checkbox (rather than setting the
   * `checked` property programmatically). However, we feel that this behavior is more accommodating
   * to the way consumers would envision using this component.
   */
  @Input() get indeterminate() {
    return this._indeterminate;
  }

  set indeterminate(indeterminate: boolean) {
    this._indeterminate = indeterminate;
    if (this._indeterminate) {
      this._transitionCheckState(TransitionCheckState.Indeterminate);
    } else {
      this._transitionCheckState(
        this.checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * TODO: internal
   */
  writeValue(value: any) {
    this.checked = !!value;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * TODO: internal
   */
  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * TODO: internal
   */
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  private _transitionCheckState(newState: TransitionCheckState) {
    let oldState = this._currentCheckState;
    let renderer = this._renderer;
    let elementRef = this._elementRef;

    if (oldState === newState) {
      return;
    }

    this._currentCheckState = newState;

  }

  private _emitChangeEvent() {
    let event = new CustomCheckboxChange();
    event.source = this;
    event.checked = this.checked;

    this._controlValueAccessorChangeFn(this.checked);
    this.change.emit(event);
  }

  /**
   * Informs the component when the input has focus so that we can style accordingly
   * @internal
   */
  onInputFocus() {
    this.hasFocus = true;
  }

  /**
   * Informs the component when we lose focus in order to style accordingly
   * @internal
   */
  onInputBlur() {
    this.hasFocus = false;
    this.onTouched();
  }

  /**
   * Toggles the `checked` value between true and false
   */
  toggle() {
    this.checked = !this.checked;
  }

  /**
   * Event handler for checkbox input element.
   * Toggles checked state if element is not disabled.
   * @param event
   * @internal
   */
  onInteractionEvent(event: Event) {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();

    if (!this.disabled) {
      this.toggle();
    }
  }

  /** @internal */
  onInputClick(event: Event) {
    // We have to stop propagation for click events on the visual hidden input element.
    // By default, when a user clicks on a label element, a generated click event will be
    // dispatched on the associated input element. Since we are using a label element as our
    // root container, the click event on the `checkbox` will be executed twice.
    // The real click event will bubble up, and the generated click event also tries to bubble up.
    // This will lead to multiple click events.
    // Preventing bubbling for the second event will solve that issue.
    event.stopPropagation();
  }
}
