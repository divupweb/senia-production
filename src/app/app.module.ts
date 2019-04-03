import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Http, HttpModule } from '@angular/http';
import {TranslateModule, TranslateLoader, MissingTranslationHandler} from "@ngx-translate/core";
import { CookieLawModule } from 'angular2-cookie-law';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { AppState, InternalStateType } from './app.service'; // del
import { ErrorsModule } from './errors';

import { ToastyModule } from 'ng2-toasty';

import { APP_PROVIDERS } from './app.providers';
import { APP_GUARDS } from './app.guards';
import { AppMissingTranslationHandler, AppTranslationLoader } from "app/services/translate";
import { PrivacyPolicyModule } from 'app/shared/components/privacy-policy';

interface StoreType {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
}

export function HttpLoaderFactory(http: Http) {
  return new AppTranslationLoader(http, "./assets/i18n/", ".json");
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: false }),
    ToastyModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [Http]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: AppMissingTranslationHandler
      }
    }),
    ErrorsModule,
    CookieLawModule,
    PrivacyPolicyModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    APP_GUARDS
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    // console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      setTimeout(store.restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    store.state = this.appState._state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
