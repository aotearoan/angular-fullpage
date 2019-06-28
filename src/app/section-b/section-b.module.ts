import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FullpageModule } from '@aotearoan/angular-fullpage';
import { SectionModule } from '../section/section.module';
import { SectionBComponent } from './section-b.component';

@NgModule({
  declarations: [SectionBComponent],
  exports: [SectionBComponent],
  imports: [
    CommonModule,
    SectionModule,
    FullpageModule,
    RouterModule,
  ],
})
export class SectionBModule { }
