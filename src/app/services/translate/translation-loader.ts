import { Observable } from "rxjs/Observable";
import { TranslateLoader } from "@ngx-translate/core";
import { Http, RequestOptionsArgs, Headers } from "@angular/http";

export class AppTranslationLoader implements TranslateLoader {

  protected defaultOptions: RequestOptionsArgs = {
    headers: new Headers({'Cache-Control':'no-cache, no-store, must-revalidate'}),
  };

  public constructor(protected http: Http, protected prefix?: string, protected suffix?: string) {}

  public getTranslation(lang: string): Observable<JSON> {
    return this.http.get("" + this.prefix + lang + this.suffix, this.defaultOptions)
      .map((res) => res.json()[lang]);
  }
}
