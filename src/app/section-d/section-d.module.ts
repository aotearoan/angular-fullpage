import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FullpageModule } from '@aotearoan/angular-fullpage';
import { SectionModule } from '../section/section.module';
import { SectionDComponent } from './section-d.component';

@NgModule({
  declarations: [SectionDComponent],
  exports: [SectionDComponent],
  imports: [
    CommonModule,
    SectionModule,
    FullpageModule,
    RouterModule,
  ],
})
export class SectionDModule { }
