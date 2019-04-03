import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class UserMenuService {
  isMenuOpen = false;
  isAsideOpen = false;
  menuToggle() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  close() {
    this.isMenuOpen = false;
  }
}
