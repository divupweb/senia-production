import { NgModule } from '@angular/core';
import { ModalModule } from 'ng2-bootstrap';
import { ReactiveFormsModule  } from '@angular/forms';
import { DecisionMakerComponent } from './decision-maker.component';
import { DecisionMakerApiService } from './decision-maker-api.service';
import {AppCommonModule} from "app/shared";

@NgModule({
  declarations: [ DecisionMakerComponent ],
  imports: [ ModalModule.forRoot(), ReactiveFormsModule, AppCommonModule],
  exports: [ DecisionMakerComponent ]
})

export class DecisionMakerModule {
  static forRoot() {
    return {
      ngModule: DecisionMakerModule,
      providers: [ DecisionMakerApiService ]
    };
  }
}
