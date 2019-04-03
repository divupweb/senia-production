import { Response } from '@angular/http';

export class Parser {
  static parse(msg) {
    var _msg = msg;
    if (!msg) {
      _msg = '';
    } else if (_.isObjectLike(msg, Response) && _.includes([0], msg.status)) {
      _msg = 'Sorry, something went wrong. Please refresh the page or try again later';
    } else if (typeof msg.json === 'function') {
      try {
        _msg = msg.json();
      } catch(e) {
        if (typeof msg.text === 'function') _msg = msg.text();
      }
    } else {
      try {
        _msg = JSON.parse(msg);
      } catch(e) { }
    }

    if (_.isObject(_msg)) {
      if (_msg['error']) {
        _msg = _msg['error']
      } else if (_msg['base']){
        _msg = _msg['base'].join(', ')
      }
    };

    return String(_msg).slice(0, 1000);
  }
}
