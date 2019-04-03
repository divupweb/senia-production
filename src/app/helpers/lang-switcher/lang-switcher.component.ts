import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AppStateService, AuthService, ToastService } from "app/services";
import { UserSettingsApiService } from 'app/user/services';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'lang-switcher',
  styleUrls: ['lang-switcher.scss'],
  templateUrl: 'lang-switcher.html',
})
export class LangSwitcherComponent {

  @Input()
  public customClass: any = {};

  public constructor(public translate: TranslateService,
                     protected state: AppStateService,
                     protected auth: AuthService,
                     protected api: UserSettingsApiService,
                     protected toast: ToastService) {}

  public change(locale: string): void {
    const subject = this.state.currentUser() ? this.api.update({ locale }) : this.createSubject();
    subject.subscribe(() => this.state.setLang(locale), (error) => this.toast.error(error));
  }

  protected createSubject(): Observable<any> {
    return Observable.create((subject) => {
      subject.next();
      subject.complete();
    });
  }
}
