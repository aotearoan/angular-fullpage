import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FullpageModule } from '@aotearoan/angular-fullpage';
import { SectionModule } from '../section/section.module';
import { SectionCComponent } from './section-c.component';

@NgModule({
  declarations: [SectionCComponent],
  exports: [SectionCComponent],
  imports: [
    CommonModule,
    SectionModule,
    FullpageModule,
    RouterModule,
  ],
})
export class SectionCModule { }
