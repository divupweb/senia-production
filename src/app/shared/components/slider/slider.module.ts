import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NouisliderModule } from 'ng2-nouislider';
import { SliderComponent } from './slider.component';

@NgModule({
  declarations: [ SliderComponent ],
  imports: [
    CommonModule,
    NouisliderModule
  ],
  exports: [ SliderComponent ]
})

export class SliderModule {}
