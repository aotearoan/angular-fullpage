import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SectionComponent } from './section.component';

@NgModule({
  declarations: [SectionComponent],
  exports: [SectionComponent],
  imports: [CommonModule],
})
export class SectionModule { }
