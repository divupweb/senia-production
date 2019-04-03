import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<any> {

  canDeactivate(component) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }

}
