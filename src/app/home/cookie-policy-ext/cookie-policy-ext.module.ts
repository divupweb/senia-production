import { NgModule } from '@angular/core';
import { CookiePolicyExtComponent } from './cookie-policy-ext.component';
import {AppCommonModule} from "app/shared";

@NgModule({
    declarations: [ CookiePolicyExtComponent ],
    imports: [ AppCommonModule],
    exports: [ CookiePolicyExtComponent ]
})

export class CookiePolicyExtModule {
}
