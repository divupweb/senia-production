import { trigger, state, transition, animate, style } from '@angular/animations';

export abstract class SlideInOut {
  public static animation = trigger('slideInOut', [
    state('true', style({ height: '0px', overflow: 'hidden' })),
    state('false', style({ height: '*', overflow: 'hidden' })),
    transition('1 => 0', animate('500ms ease-in')),
    transition('0 => 1', animate('500ms ease-out'))
  ]);
}
