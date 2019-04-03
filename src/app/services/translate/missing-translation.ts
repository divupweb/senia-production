import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';

export class AppMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return `missing.${params.translateService.currentLang}.${params.key}`;
  }
}
