import { WindowRef } from './window-ref';

export class ParamsUrlParser {
  static isKitchen(): boolean {
    return _.includes(WindowRef.nativeWindow.location.pathname.split(/-|\//), 'kitchen')
  }

  static isEmployee(): boolean {
    return _.includes(WindowRef.nativeWindow.location.pathname.split('/'), 'employee');
  }
}
