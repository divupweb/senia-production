import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageBoxComponent } from './image-box.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ImageBoxComponent],
  exports: [ImageBoxComponent]
})
export class ImageBoxModule { }
