import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FullpageModule } from '@aotearoan/angular-fullpage';
import { SectionModule } from '../section/section.module';
import { SectionAComponent } from './section-a.component';

@NgModule({
  declarations: [SectionAComponent],
  exports: [SectionAComponent],
  imports: [
    CommonModule,
    SectionModule,
    FullpageModule,
    RouterModule,
  ],
})
export class SectionAModule { }
