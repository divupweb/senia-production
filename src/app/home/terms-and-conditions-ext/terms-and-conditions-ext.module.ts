import { NgModule } from '@angular/core';
import { TermsAndConditionsExtComponent } from './terms-and-conditions-ext.component';
import {AppCommonModule} from "app/shared";

@NgModule({
    declarations: [ TermsAndConditionsExtComponent ],
    imports: [ AppCommonModule],
    exports: [ TermsAndConditionsExtComponent ]
})

export class TermsAndConditionsExtModule {
}
